import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbMateriasCarrera";

export const getMateriaCarrera = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener las materias" })
    }
}

export const getMateriaCarreraById = async (req,res) => {
    try {
        const {id} = req.params
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

export const addMateriaCarrera = async (req,res) => {
    try {
        const {id_materia, id_carrera} = req.body
        const result = await insertDato(tabla, {id_materia, id_carrera})
        if (result === 0) {
            return res.status(404).json({ message: "Materia o Carrera no encontrada" })
        }
        res.json({ message: "Materia insertada" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar la materia" })
    }
}

export const updateMateriaCarrera = async (req,res) =>  {
    try {
        const {id} = req.params 
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

export const deleteMateriaCarrera = async (req,res) => {
    try {
        const {id} = req.params 
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            return res.status(404).json({ message: "Materia no encontrada" })
        }
        res.json({ message: "Materia eliminada" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar la materia" })
    }
}