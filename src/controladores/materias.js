import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tb_materias";

export const getMaterias = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener las materias" })
    }
}

export const getMateriaById = async (req, res) => {

    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Materia no encontrada" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener la materia" })
    }
}

export const addMateria = async (req, res) => {
    try {
        const { nombre_materia } = req.body
        const result = await insertDato(tabla, { nombre_materia })
        if (result === 0) {
            return res.status(404).json({ message: "Materia no encontrada" })
        }
        res.json({ message: "Materia insertada" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar la materia" })
    }
}

export const updateMateria = async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: "Materia no encontrada" })
        }
        res.json({ message: "Materia actualizada" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar la materia" })
    }
}

export const deleteMateria = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            return res.status(404).json({ message: "Materia no encontrada o invalida" })
        }
        res.json({ message: "Materia eliminada" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar la materia" })
    }
}