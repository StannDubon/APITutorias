import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbDiaSemanas";
import { catchAsync, AppError } from "../middlewares/errorHandler.js";

//Obtener
export const get_dia_semana = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener los días de la semana", 500)
    }
}); 

//Obtener por ID
export const get_dia_seamana_id = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Dia de la semana no encontrado", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener el dia de la semana", 500)
    }
});
//Update 
export const update_dia_semana = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Dia de la semana no encontrado", 404)
        }
        res.json({ message: "Dia de la semana actualizado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar el dia de la semana", 500)
    }
});

//INSERCCION
export const insert_dia_seamana = catchAsync(async (req, res) => {

    try {
        const { dia_semana } = req.body
        const result = await insertDato(tabla, { dia_semana })
        if (result === 0) {
            throw new AppError("Dia de la semana no encontrado", 404)
        }
        res.json({ message: "Dia de la semana insertado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar el Dia de la semana o Dia de la semana duplicado", 500)
    }
});

//ELIMINAR 
export const delete_dia_semana = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw new AppError("Dia de la semana no encontrado", 404)
        }
        res.json({ message: "Dia de la semana eliminado" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar el Dia de la semana", 500)
    }
});
