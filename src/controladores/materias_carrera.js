import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato, ejecutarProcedimiento } from "../utilidades/querys.js"
const tabla = "tbMateriasCarrera";
const procedimientoAdd = "procd_AgregarMateriaACarrera"
const procedimientoDelete = "procd_EliminarMateriaDeCarrera"
const vista = "vw_MateriasConCarrera"
import {catchAsync, AppError} from "../middlewares/errorHandler.js"

export const getMateriaCarrera = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener las materias", 500)
    }
})
export const getVistaMateriaCarrera = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(vista);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener las materias con carrera", 500)
    }
})

export const getMateriaCarreraById = catchAsync(async (req,res) => {
    try {
        const {id} = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Materia no encontrada", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener la materia", 500)
    }
})


export const updateMateriaCarrera = catchAsync(async (req,res) =>  {
    try {
        const {id} = req.params 
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Materia no encontrada", 404)
        }
        res.json({ message: "Materia actualizada" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar la materia", 500)
    }
})

export const procedimientoAgregarMateriaCarrera = catchAsync(async (req,res) => {
    try {
        const {id_materia, id_carrera} = req.body
        const result = await ejecutarProcedimiento(procedimientoAdd, {id_materia, id_carrera})
        if (result === 0) {
            throw new AppError("Materia o Carrera no encontrada", 404)
        }
        res.json({ message: "Materia insertada" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar la materia", 500)
    }
})

export const procedimientoEliminarMateriaDeCarrera = catchAsync(async (req,res) => {
    try {
        const {id_materia, id_carrera} = req.body
        const result = await ejecutarProcedimiento(procedimientoDelete, {id_materia, id_carrera})
        
        // El procedimiento ahora retorna un recordset con Resultado y Mensaje
        if (result && result.length > 0) {
            const procedimientoResult = result[0];
            
            if (procedimientoResult.Resultado === 0) {
                // Manejar diferentes tipos de errores del procedimiento
                if (procedimientoResult.Mensaje.includes('tutorías asociadas')) {
                    throw new AppError(procedimientoResult.Mensaje, 409); // Conflict
                } else if (procedimientoResult.Mensaje.includes('no está asignada')) {
                    throw new AppError(procedimientoResult.Mensaje, 404); // Not Found
                } else {
                    throw new AppError(procedimientoResult.Mensaje, 400); // Bad Request
                }
            }
            
            // Éxito
            res.json({ 
                status: "success",
                message: procedimientoResult.Mensaje || "Materia eliminada correctamente"
            });
        } else {
            throw new AppError("No se recibió respuesta del servidor", 500);
        }
        
    } catch (error) {
        console.log(error)
        // Si ya es un AppError, lo re-lanzamos, sino creamos uno nuevo
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || "Error al eliminar la materia", 500);
    }
})

export const procedimientoEliminarMateriaDeCarreraConCascada = catchAsync(async (req,res) => {
    try {
        const {id_materia, id_carrera} = req.body
        const result = await ejecutarProcedimiento('procd_EliminarMateriaDeCarrera', {id_materia, id_carrera})
        
        if (result && result.length > 0) {
            const procedimientoResult = result[0];
            
            if (procedimientoResult.Resultado === 0) {
                if (procedimientoResult.Mensaje.includes('no está asignada')) {
                    throw new AppError(procedimientoResult.Mensaje, 404);
                } else {
                    throw new AppError(procedimientoResult.Mensaje, 400);
                }
            }
            
            res.json({ 
                status: "success",
                message: procedimientoResult.Mensaje || "Materia y datos relacionados eliminados correctamente"
            });
        } else {
            throw new AppError("No se recibió respuesta del servidor", 500);
        }
        
    } catch (error) {
        console.log(error)
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || "Error al eliminar la materia con datos relacionados", 500);
    }
})