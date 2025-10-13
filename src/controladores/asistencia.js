import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbAsistencias";

export const getAsistencia = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener las asistencias" })
    }
}

export const getAsistenciaById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Asistencia no encontrada" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener la asistencia" })
    }
}

export const updateAsistencia = async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: "Asistencia no encontrada" })
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar la asistencia" })
    }
}

export const insertAsistencia = async (req, res) => {
    try {
        const result = await insertDato(tabla, req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar la asistencia" })
    }
}

export const deleteAsistencia = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            return res.status(404).json({ message: "Asistencia no encontrada" })
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar la asistencia" })
    }
}