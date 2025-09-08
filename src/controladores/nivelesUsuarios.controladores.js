import { getConnection } from "../db/conexion.js"
import sql from "mssql"
import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tb_niveles_usuario";


export const getEstados = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener los estados" })
    }
}

export const getEstadoById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Estado no encontrado" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener el estado" })
    }
}

export const updateEstado = async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: "Estado no encontrado" })
        }
        res.json({ message: "Estado actualizado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar el estado" })
    }
}

export const insertEstado = async (req, res) => {

    try {
        const { nivel } = req.body
        const result = await insertDato(tabla, { nivel })
        if (result === 0) {
            return res.status(404).json({ message: "Estado no encontrado" })
        }
        res.json({ message: "Estado insertado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar el estado" })
    }

}

export const deleteEstado = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            return res.status(404).json({ message: "Estado no encontrado" })
        }
        res.json({ message: "Estado eliminado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar el estado" })
    }
}



