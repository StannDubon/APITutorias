import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbTiposTutoria";
import { catchAsync, AppError } from "../middlewares/errorHandler.js";

export const getTiposTutoria = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener los tipos de tutoria", 500)
    }
});

export const getTipoTutoriabyId = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Tipo de tutoria no encontrado", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener el tipo de tutoria", 500)
    }
});

export const addTipoTutoria = catchAsync(async (req, res) => {
    try {
        const { tipo_tutoria } = req.body
        const result = await insertDato(tabla, { tipo_tutoria })
        if (result === 0) {
            throw new AppError("Tipo de tutoria no encontrado", 404)
        }
        res.json({ message: "Tipo de tutoria insertado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar el tipo de tutoria o dato duplicado", 500)
    }
});

export const updateTipoTutoria = catchAsync(async (req,res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Tipo de tutoria no encontrado", 404)
        }
        res.json({ message: "Tipo de tutoria actualizado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar el tipo de tutoria", 500)
    }
});

export const deleteTipoTutoria = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw new AppError("Tipo de tutoria no encontrado", 404)
        }
        res.json({ message: "Tipo de tutoria eliminado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar el tipo de tutoria", 500)
    }
});