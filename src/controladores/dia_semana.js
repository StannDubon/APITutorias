import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tb_dias_semana";

//Obtener
export const get_dia_semana = async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener los días de la semana" })
    }
}

//Obtener por ID
export const get_dia_seamana_id = async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            return res.status(404).json({ message: "Dia de la semana no encontrado" })
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener el dia de la semana" })
    }
}
//Update 
export const update_dia_semana = async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            return res.status(404).json({ message: " Dia de la semana no encontrado" })
        }
        res.json({ message: "Dia de la semana actualizado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar el dia de la semana" })
    }
}
//INSERCCION
export const insert_dia_seamana = async (req, res) => {

    try {
        const { dia_semana } = req.body
        const result = await insertDato(tabla, { dia_semana })
        if (result === 0) {
            return res.status(404).json({ message: "Dia de la semana no encontrado" })
        }
        res.json({ message: "Dia de la semana insertado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al insertar el Dia de la semana o Dia de la semana duplicado" })
    }

}

//ELIMINAR 
export const delete_dia_semana = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            return res.status(404).json({ message: "Dia de la semana no encontrado" })
        }
        res.json({ message: "Dia de la semana eliminado" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar el Dia de la semana" })
    }
}
