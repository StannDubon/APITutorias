import { todosDatos, unSoloDato, updateDato, insertDato, deleteDato, ejecutarProcedimiento, ejecutarVista} from "../utilidades/querys.js"
import { catchAsync, AppError } from "../middlewares/errorHandler.js"
const tabla = "tbAsistencias";
const vista1 = "vw_AsistenciasSimplificadas"
const procedimiento = "procd_CrearAsistencia"

export const getAsistencia = catchAsync(async (req, res) => {
    try {
        const result = await todosDatos(tabla);
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener las asistencias", 500)
    }   
});

export const getAsistenciaById = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await unSoloDato(tabla, id)
        if (result.length === 0) {
            throw new AppError("Asistencia no encontrada", 404);
        }
        res.json(result[0])
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener la asistencia", 500)
    }
});

export const getAsistenciasByTutoria = catchAsync(async (req,res) => {
    try {
        const {id} = req.params
        const result = await ejecutarVista(vista1, {
            id_tutoria: parseInt(id)
        })
        res.json(result)
    } catch (error) {
        console.log(error)
        throw new AppError("Error al obtener la carrera", 500)
    }
});

export const updateAsistencia = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateDato(tabla, id, req.body)
        if (result === 0) {
            throw new AppError("Asistencia no encontrada", 404);
        }
        res.json({ message: "Asistenca actualizada exitosamente" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al actualizar la asistencia", 500)
    }
});

export const deleteAsistencia = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteDato(tabla, id)
        if (result === 0) {
            throw new AppError("Asistencia no encontrada", 404);
        }
        res.json({ message: "Asistenca eliminada exitosamente" })
    } catch (error) {
        console.log(error)
        throw new AppError("Error al eliminar la asistencia", 500)
    }
});

export const crearAsistencia = catchAsync(async (req, res) => {
    try {
        const { id_usuario, id_tutoria, rendimiento_aprendizaje, rendimiento_dedicacion } = req.body;

        if (!id_usuario || !id_tutoria || rendimiento_aprendizaje === undefined || rendimiento_dedicacion === undefined) {
            throw new AppError("Todos los campos son requeridos: id_usuario, id_tutoria, rendimiento_aprendizaje, rendimiento_dedicacion", 400);
        }

        if (isNaN(parseInt(id_usuario)) || isNaN(parseInt(id_tutoria))) {
            throw new AppError("id_usuario e id_tutoria deben ser números válidos", 400);
        }

        if (rendimiento_aprendizaje < 0 || rendimiento_aprendizaje > 100) {
            throw new AppError("El rendimiento_aprendizaje debe estar entre 0 y 100", 400);
        }

        if (rendimiento_dedicacion < 0 || rendimiento_dedicacion > 100) {
            throw new AppError("El rendimiento_dedicacion debe estar entre 0 y 100", 400);
        }

        const datosAsistencia = {
            id_usuario: parseInt(id_usuario),
            id_tutoria: parseInt(id_tutoria),
            rendimiento_aprendizaje: parseInt(rendimiento_aprendizaje),
            rendimiento_dedicacion: parseInt(rendimiento_dedicacion)
        };

        const result = await ejecutarProcedimiento('procd_CrearAsistencia', datosAsistencia);
        
        if (result && result.length > 0 && result[0].Resultado === 0) {
            throw new AppError(result[0].Mensaje || "Error al crear la asistencia", 400);
        }

        res.json({ 
            status: "success",
            message: "Asistencia creada exitosamente",
            data: result[0] // Incluir los datos retornados por el procedimiento
        });
        
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Error al crear la asistencia", 500);
    }
});