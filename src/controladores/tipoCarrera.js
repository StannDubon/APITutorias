import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato } from "../utilidades/querys.js"
const tabla = "tbTiposCarrera";
import { catchAsync, AppError } from "../middlewares/errorHandler.js";

export const getTipoCarreras = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener las carreras", 500)
    }
});

export const getTipoCarreraById = catchAsync(async (req,res) => {
    try{
        const {id} = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Carrera no encontrada", 404)
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener la carrera", 500)
    }
});

export const addTipoCarrera = catchAsync(async (req,res) => {
    try {
        const {tipo_carrera} = req.body
        const result = await insertDato(tabla, {tipo_carrera})
        if (result === 0) {
            throw new AppError("Carrera no encontrada", 404)
        }
        res.json({ message: "Carrera insertada" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar la carrera", 500)
    }
});

export const updateTipoCarrera = catchAsync(async (req,res) => {
    try {
        const {id} = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Carrera no encontrada", 404)
        }
        res.json({ message: "Carrera actualizada" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar la carrera", 500)
    }
});

export const deleteTipoCarrera = catchAsync(async (req,res) => {
    try {
        const {id} = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw new AppError("Carrera no encontrada", 404)
        }
        res.json({ message: "Carrera eliminada" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar la carrera", 500)
    }
});