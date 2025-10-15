import Joi from "joi";

//Validacion para tbTiposTutoria
export const crearTipoTutoria = Joi.object({
    tipo_tutoria: Joi.string().required(),
})

//Validacion para tbTutorias
export const crearTutoria = Joi.object({
    id_materia_carrera: Joi.number().required(),
    id_tutor: Joi.number().required(),
    id_tipo_tutoria: Joi.number().required(),
    id_horario_dia_semana: Joi.number().required(),
    activo: Joi.number().required(),
    aula_tutoria: Joi.string().required(),
})

export const actualizarTutoria = Joi.object({
    id_materia_carrera: Joi.number(),
    id_tutor: Joi.number(),
    id_tipo_tutoria: Joi.number(),
    id_horario_dia_semana: Joi.number(),
    activo: Joi.number(),
    aula_tutoria: Joi.string(),
})

export const asistenciaTutoria = Joi.object({
    id_usuario: Joi.number().required(),
    id_tutoria: Joi.number().required(),
    rendimiento_aprendizaje: Joi.number().required(),
    rendimiento_dedicacion: Joi.number().required(),
    fecha_asistencia: Joi.date().required(),
})