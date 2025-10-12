import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbUsuarios";

export const getUsuarios = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener los usuarios" })
    }
}

export const getUsuarioById = async (req, res) => {
    try {
        const {id} = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener el usuario" })
    }
}

export const addUsuario = async (req, res) => {
    try {
        const {id_nivel, carnet, estado, claveHasheada, nombre, apellido, correo} = req.body
        const result = await insertDato(tabla, {id_nivel, carnet, estado, claveHasheada, nombre, apellido, correo})


        if (result === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        res.json({ message: "Usuario insertado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar el usuario" })
    }
}

export const updateUsuario = async (req,res) => {
    try {
        const {id} = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        res.json({ message: "Usuario actualizado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar el usuario" })
    }
}

export const deleteUsuario = async (req, res) => {
    try {
        const {id} = req.params 
        const result = await deleteDato(tabla,id) 
        if (result === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        res.json({ message: "Usuario eliminado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar el usuario" })
    }
}

export const desbloquearUsuario = async (req, res) => {
    try {
        const {id} = req.params 
        const result = await updateDato(tabla,id, {estado: 1}) 
        if (result === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        res.json({ message: "Usuario desbloqueado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al desbloquear el usuario" })
    }
}