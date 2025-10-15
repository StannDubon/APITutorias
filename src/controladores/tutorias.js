import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbTutorias";
import { catchAsync, AppError } from "../middlewares/errorHandler.js";

export const getTutoria = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener las tutorias", 500)
    }
});

export const getTutoriaId = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Tutoria no encontrada", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener la tutoria", 500)
    }
});

export const updateTutoria = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Tutoria no encontrada", 404)
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar la tutoria", 500)
    }
});

export const insertTutoria = catchAsync(async (req, res) => {
    try {
        const result = await insertDato(tabla, req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar la tutoria", 500)
    }
});

export const deleteTutoria = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)  
        if (result === 0) {
            throw new AppError("Tutoria no encontrada", 404)
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar la tutoria", 500)
    }
});

