import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tb_horarios";

// Controladores para manejar los horarios 

// Obtener todos los horarios
export const getHoraio = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener los horarios" })
    }
}

// Obtener un horario por ID 
export const getHoraioId = async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Horario no encontrado" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener el Horario" })
    }
}

// Actualiar Horario 
export const updateHorario = async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: "Horario no encontrado" })
        }
        res.json({ message: "Horario actualizado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar el Horario " })
    }
}


// Insertar Horario 
export const insertHorario = async (req, res) => {

    try {
        const { hora_inicio, hora_final } = req.body
        const result = await insertDato(tabla, { hora_inicio, hora_final })
        if (result === 0) {
            return res.status(404).json({ message: "Horario no encontrado" })
        }
        res.json({ message: "Horario insertado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar el Horario o Horario duplicado" })
    }

}

// DELETE Horario
export const deleteHorario = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            return res.status(404).json({ message: "Horario no encontrado" })
        }
        res.json({ message: "Horario eliminado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar el Horario" })
    }
}
