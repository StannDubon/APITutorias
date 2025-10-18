import { catchAsync, AppError } from "../middlewares/errorHandler.js";
import bcrypt from "bcrypt";
import sql from "mssql";
import {getConnection} from "../db/conexion.js"
import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato, ejecutarVista } from "../utilidades/querys.js"

const tabla = "tbUsuarios";
const vista = "vw_UsuariosBasicos"
const vista1 = "vw_TutoriasFormateadas";
const vista2 = "vw_UsuariosAcademicos";

export const getUsuarios = catchAsync(async (req, res) => {
    const result = await todosDatos(tabla);
    res.json(result);
});

export const getVistaUsuariosBasicos = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(vista);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener los usuarios basicos", 500)
    }
})

export const getVistaUsuariosAcademicos = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(vista2);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener los usuarios basicos", 500)
    }
})

export const getVistaTutoriaUsuario = catchAsync(async (req,res) => {
    try {
        const {id} = req.params
        const result = await ejecutarVista(vista1, {
            id_tutor: parseInt(id)
        })
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener la carrera", 500)
    }
});

export const getUsuarioById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await unSoloDato(tabla, id);
    
    if (result.length === 0) {
        throw  new AppError("Usuario no encontrado", 404);
    }
    
    res.json(result);
});

export const addUsuario = catchAsync(async (req, res) => {
    const { id_nivel, carnet, estado, clave, nombre, apellido, correo } = req.body;
    
    // Hashear la contraseña
    const saltRounds = 10;
    const claveHasheada = await bcrypt.hash(clave, saltRounds);
    
    const result = await insertDato(tabla, {
        id_nivel, 
        carnet, 
        estado, 
        clave: claveHasheada,
        nombre, 
        apellido, 
        correo
    });
    
    if (result === 0) {
        throw  new AppError("Error al crear usuario", 400);
    }
    
    res.status(201).json({ 
        message: "Usuario creado exitosamente",
    });
});

export const updateUsuario = catchAsync(async (req, res) => {
    const { id } = req.params;
    const datosActualizar = { ...req.body };
    
    // Si viene contraseña, hashearla
    if (datosActualizar.clave) {
        const saltRounds = 10;
        datosActualizar.clave = await bcrypt.hash(datosActualizar.clave, saltRounds);
    }
    
    const result = await updateDato(tabla, id, datosActualizar);
    
    if (result === 0) {
        throw  new AppError("Usuario no encontrado", 404);
    }
    
    res.json({ message: "Usuario actualizado exitosamente" });
});

export const deleteUsuario = catchAsync(async (req, res) => {
    const { id } = req.params;
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    
    try {
        await transaction.begin();
        
        // Verificar si el usuario existe
        const checkUser = await transaction.request()
            .input('id_usuario', sql.Int, id)
            .query('SELECT id_usuario FROM tbUsuarios WHERE id_usuario = @id_usuario');
        
        if (checkUser.recordset.length === 0) {
            await transaction.rollback();
            throw new AppError("Usuario no encontrado", 404);
        }
        
        
        await transaction.request()
            .input('id_usuario', sql.Int, id)
            .query('DELETE FROM tbAsistencias WHERE id_usuario = @id_usuario');
        
        await transaction.request()
            .input('id_usuario', sql.Int, id)
            .query(`
                DELETE FROM tbAsistencias 
                WHERE id_tutoria IN (
                    SELECT id_tutoria FROM tbTutorias WHERE id_tutor = @id_usuario
                )
            `);
        
        await transaction.request()
            .input('id_usuario', sql.Int, id)
            .query('DELETE FROM tbTutorias WHERE id_tutor = @id_usuario');
        
        await transaction.request()
            .input('id_usuario', sql.Int, id)
            .query('DELETE FROM tbRefreshTokens WHERE id_usuario = @id_usuario');
        
        await transaction.request()
            .input('id_usuario', sql.Int, id)
            .query('DELETE FROM tbUsuarios WHERE id_usuario = @id_usuario');
        
        await transaction.commit();
        
        res.json({ 
            message: "Usuario eliminado exitosamente",
            detalles: "Se eliminaron todas las asistencias, tutorías y tokens asociados"
        });
        
    } catch (error) {
        if (transaction) {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.log("Error en rollback:", rollbackError);
            }
        }
        console.log(error);
        
        if (error instanceof AppError) {
            throw error;
        }
        
        throw new AppError("Error al eliminar el usuario", 500);
    }
});


export const desbloquearUsuario = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await updateDato(tabla, id, { 
        estado: 1,
        intentos_login: 0,
        fecha_bloqueo: null
    });
    
    if (result === 0) {
        throw  AppError("Usuario no encontrado", 404);
    }
    
    res.json({ message: "Usuario desbloqueado exitosamente" });
});