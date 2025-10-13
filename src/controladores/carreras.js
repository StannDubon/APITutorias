import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbCarreras";

export const getCarreras = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener las carreras" })
    }
}

export const getCarrerasById = async (req,res) => {
    try {
        const {id} = req.params
        const result = await unSoloDato(tabla,id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Carrera no encontrada" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener la carrera" })
    }
}

export const addCarrera = async (req,res) => {
    try {
        const {id_tipo_carrera, nombre_carrera} = req.body
        const result = await insertDato(tabla, {id_tipo_carrera, nombre_carrera})
        if (result === 0) {
            return res.status(404).json({ message: "Carrera no encontrada" })
        }
        res.json({ message: "Carrera insertada" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar la carrera" })
    }
}

export const updateCarrera = async(req, res) => {
    try {
        const {id} = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: "Carrera no encontrada" })
        }
        res.json({ message: "Carrera actualizada" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar la carrera" })
    }
}

export const deleteCarrera = async (req,res) => {
    try {
        const {id} = req.params
        const result = await deleteDato(tabla,id)
        if (result === 0) {
            return res.status(404).json({ message: "Carrera no encontrada" })
        }
        res.json({ message: "Carrera eliminada" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar la carrera" })
    }
}