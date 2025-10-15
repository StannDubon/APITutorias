import { catchAsync, AppError } from "../middlewares/errorHandler.js";
import bcrypt from "bcrypt";
import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"

const tabla = "tbUsuarios";

export const getUsuarios = catchAsync(async (req, res) => {
    const result = await todosDatos(tabla);
    res.json(result);
});

export const getUsuarioById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await unSoloDato(tabla, id);
    
    if (result.length === 0) {
        throw new AppError("Usuario no encontrado", 404);
    }
    
    res.json(result[0]);
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
        throw new AppError("Error al crear usuario", 400);
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
        throw new AppError("Usuario no encontrado", 404);
    }
    
    res.json({ message: "Usuario actualizado exitosamente" });
});

export const deleteUsuario = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await deleteDato(tabla, id);
    
    if (result === 0) {
        throw new AppError("Usuario no encontrado", 404);
    }
    
    res.json({ message: "Usuario eliminado exitosamente" });
});

export const desbloquearUsuario = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await updateDato(tabla, id, { 
        estado: 1,
        intentos_login: 0,
        fecha_bloqueo: null
    });
    
    if (result === 0) {
        throw new AppError("Usuario no encontrado", 404);
    }
    
    res.json({ message: "Usuario desbloqueado exitosamente" });
});