import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbTutorias";

export const getTutoria = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener las tutorias" })
    }
}

export const getTutoriaId = async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Tutoria no encontrada" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener la tutoria" })
    }
}

export const updateTutoria = async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: "Tutoria no encontrada" })
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar la tutoria" })
    }
}

export const insertTutoria = async (req, res) => {
    try {
        const result = await insertDato(tabla, req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar la tutoria" })
    }
}

export const deleteTutoria = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            return res.status(404).json({ message: "Tutoria no encontrada" })
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar la tutoria" })
    }
}

