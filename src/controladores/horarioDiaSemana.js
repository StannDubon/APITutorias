import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
import {catchAsync, AppError} from "../middlewares/errorHandler.js"
const tabla = "tbHorarioDiaSemanas";

export const getHorarioDiaSemana = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener los horarios de la semana", 500)
    }
})

export const getHorarioDiaSemanaId = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Horario de la semana no encontrado", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener el horario de la semana", 500)
    }
})

export const updateHorarioDiaSemana = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Horario de la semana no encontrado", 404)
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar el horario de la semana", 500)
    }
})

export const insertHorarioDiaSemana = catchAsync(async (req, res) => {
    try {
        const result = await insertDato(tabla, req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar el horario de la semana", 500)
    }
})

export const deleteHorarioDiaSemana = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw new AppError("Horario de la semana no encontrado", 404)
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar el horario de la semana", 500)
    }
});
