import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbHorarioDiaSemanas";

export const getHorarioDiaSemana = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener los horarios de la semana" })
    }
}

export const getHorarioDiaSemanaId = async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Horario de la semana no encontrado" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener el horario de la semana" })
    }
}

export const updateHorarioDiaSemana = async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: "Horario de la semana no encontrado" })
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar el horario de la semana" })
    }
}

export const insertHorarioDiaSemana = async (req, res) => {
    try {
        const result = await insertDato(tabla, req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar el horario de la semana" })
    }
}

export const deleteHorarioDiaSemana = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            return res.status(404).json({ message: "Horario de la semana no encontrado" })
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar el horario de la semana" })
    }
}
