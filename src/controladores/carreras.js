import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato, ejecutarVista } from "../utilidades/querys.js"
const tabla = "tbCarreras";
const vista1 = "vw_MateriasConIndicadorCarrera";
import { catchAsync, AppError } from "../middlewares/errorHandler.js";


export const getCarreras = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener las carreras", 500)
    }
});

export const getCarrerasById = catchAsync(async (req,res) => {
    try {
        const {id} = req.params
        const result = await unSoloDato(tabla,id)
        if (result.length === 0) {
            throw new AppError("Carrera no encontrada", 404);
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener la carrera", 500)
    }
});

export const getMateriasByCarrera = catchAsync(async (req,res) => {
    try {
        const {id} = req.params
        const result = await ejecutarVista(vista1, {
            id_carrera: parseInt(id),
            order_by_pertenece_a_carrera: 'DESC',
            order_by_nombre_materia: 'ASC'
        })
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener la carrera", 500)
    }
});

export const addCarrera = catchAsync(async (req,res) => {
    try {
        const {id_tipo_carrera, nombre_carrera} = req.body
        const result = await insertDato(tabla, {id_tipo_carrera, nombre_carrera})
        if (result === 0) {
            throw new AppError("Carrera no encontrada", 404);
        }
        res.json({ message: "Carrera insertada" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al insertar la carrera", 500)
    }
});

export const updateCarrera = catchAsync(async(req, res) => {
    try {
        const {id} = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Carrera no encontrada", 404);
        }
        res.json({ message: "Carrera actualizada" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar la carrera", 500)
    }
});

export const deleteCarrera = catchAsync(async (req,res) => {
    try {
        const {id} = req.params
        const result = await deleteDato(tabla,id)
        if (result === 0) {
            throw new AppError("Carrera no encontrada", 404);
        }
        res.json({ message: "Carrera eliminada" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar la carrera", 500)
    }
});