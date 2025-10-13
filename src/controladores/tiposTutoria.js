import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbTiposTutoria";


export const getTiposTutoria = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener los tipos de tutoria" })
    }
}

export const getTipoTutoriabyId = async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Tipo de tutoria no encontrado" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener el tipo de tutoria" })
    }
}

export const addTipoTutoria = async (req, res) => {
    try {
        const { tipo_tutoria } = req.body
        const result = await insertDato(tabla, { tipo_tutoria })
        if (result === 0) {
            return res.status(404).json({ message: "Tipo de tutoria no encontrado" })
        }
        res.json({ message: "Tipo de tutoria insertado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar el tipo de tutoria o dato duplicado" })
    }
}

export const updateTipoTutoria = async (req,res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: "Tipo de tutoria no encontrado" })
        }
        res.json({ message: "Tipo de tutoria actualizado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar el tipo de tutoria" })
    }
}

export const deleteTipoTutoria = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            return res.status(404).json({ message: "Tipo de tutoria no encontrado" })
        }
        res.json({ message: "Tipo de tutoria eliminado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar el tipo de tutoria" })
    }
}