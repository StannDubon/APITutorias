import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
import {catchAsync, AppError} from "../middlewares/errorHandler.js"
const tabla = "tbHorarios";
const vista = "vw_HorariosCompletos"
// Controladores para manejar los horarios 

// Obtener todos los horarios
export const getHoraio = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener los horarios", 500)
    }
})

export const getVistaHoraio = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(vista);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener los horarios", 500)
    }
})

// Obtener un horario por ID 
export const getHoraioId = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Horario no encontrado", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener el Horario", 500)
    }
})

// Actualiar Horario 
export const updateHorario = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Horario no encontrado", 404)
        }
        res.json({ message: "Horario actualizado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar el Horario ", 500)
    }
})


// Insertar Horario 
export const insertHorario = catchAsync(async (req, res) => {

    try {
        const { hora_inicio, hora_final } = req.body
        const result = await insertDato(tabla, { hora_inicio, hora_final })
        if (result === 0) {
            throw new AppError("Horario no encontrado", 404)
        }
        res.json({ message: "Horario insertado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar el Horario o Horario duplicado", 500)
    }
})

// DELETE Horario
export const deleteHorario = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw new AppError("Horario no encontrado", 404)
        }
        res.json({ message: "Horario eliminado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar el Horario", 500)
    }
})
