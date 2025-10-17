import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato, ejecutarProcedimiento} from "../utilidades/querys.js"
import { catchAsync, AppError } from "../middlewares/errorHandler.js"
const tabla = "tbAsistencias";
const procedimiento = "procd_CrearAsistencia"

export const getAsistencia = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener las asistencias", 500)
    }   
});

export const getAsistenciaById = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Asistencia no encontrada", 404);
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener la asistencia", 500)
    }
});

export const updateAsistencia = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Asistencia no encontrada", 404);
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar la asistencia", 500)
    }
});

export const deleteAsistencia = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw new AppError("Asistencia no encontrada", 404);
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar la asistencia", 500)
    }
});

export const crearAsistencia = catchAsync(async (req, res) => {
    try {
        const result = await ejecutarProcedimiento(procedimiento, req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al crear la asistencia", 500)
    }
});