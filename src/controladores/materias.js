import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbMaterias";
import {catchAsync, AppError} from "../middlewares/errorHandler.js"

export const getMaterias = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw AppError("Error al obtener las materias", 500)
    }
})

export const getMateriaById = catchAsync(async (req, res) => {

    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw AppError("Materia no encontrada", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw AppError("Error al obtener la materia", 500)
    }
})

export const addMateria = catchAsync(async (req, res) => {
    try {
        const { nombre_materia } = req.body
        const result = await insertDato(tabla, { nombre_materia })
        if (result === 0) {
            throw AppError("Materia no encontrada", 404)
        }
        res.json({ message: "Materia insertada" })
    } catch (error) {
        console.log(error)
        throw AppError("Error al insertar la materia", 500)
    }
});

export const updateMateria = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw AppError("Materia no encontrada", 404)
        }
        res.json({ message: "Materia actualizada" })
    } catch (error) {
        console.log(error)
        throw AppError("Error al actualizar la materia", 500)
    }
});

export const deleteMateria = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw AppError("Materia no encontrada", 404)
        }
        res.json({ message: "Materia eliminada" })
    } catch (error) {
        console.log(error)
        throw AppError("Error al eliminar la materia", 500)
    }
});