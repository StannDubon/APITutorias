import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbNivelesUsuarios";
import { catchAsync, AppError } from "../middlewares/errorHandler.js";

export const getNivelesUsuarios = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new   AppError("Error al obtener los niveles de usuario", 500)
    }
});

export const getNivelUsuarioById = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Nivel de usuario no encontrado", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener el nivel de usuario", 500)
    }
});

export const updateNivelUsuario = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Nivel de usuario no encontrado", 404)
        }
        res.json({ message: "Nivel de usuario actualizado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar el nivel de usuario", 500)
    }
});

export const insertNivelUsuario = catchAsync(async (req, res) => {

    try {
        const { nivel } = req.body
        const result = await insertDato(tabla, { nivel })
        if (result === 0) {
            throw new AppError("Nivel de usuario no encontrado", 404)
        }
        res.json({ message: "Nivel de usuario insertado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar el nivel de usuario o nivel de usuario duplicado", 500)
    }
});

export const deleteNivelUsuario = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw new AppError("Nivel de usuario no encontrado", 404)
        }
        res.json({ message: "Nivel de usuario eliminado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar el nivel de usuario", 500)
    }
});



