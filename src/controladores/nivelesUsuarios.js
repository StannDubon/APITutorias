import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbNivelesUsuarios";
import { catchAsync, AppError } from "../middlewares/errorHandler.js";

export const getEstados = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new   AppError("Error al obtener los estados", 500)
    }
});

export const getEstadoById = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Estado no encontrado", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener el estado", 500)
    }
});

export const updateEstado = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Estado no encontrado", 404)
        }
        res.json({ message: "Estado actualizado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar el estado", 500)
    }
});

export const insertEstado = catchAsync(async (req, res) => {

    try {
        const { nivel } = req.body
        const result = await insertDato(tabla, { nivel })
        if (result === 0) {
            throw new AppError("Estado no encontrado", 404)
        }
        res.json({ message: "Estado insertado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar el estado o estado duplicado", 500)
    }
});

export const deleteEstado = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw new AppError("Estado no encontrado", 404)
        }
        res.json({ message: "Estado eliminado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar el estado", 500)
    }
});



