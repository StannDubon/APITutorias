import Joi from "joi";

export const Horarios = Joi.object({
    hora_inicio: Joi.date().required(),
    hora_final: Joi.date().required(),
})

export const DiasSemana = Joi.object({
    dia_semana: Joi.string().required(),
})

export const HorarioDiaSemana = Joi.object({
    id_horario: Joi.number().required(),
    id_dia_semana: Joi.number().required(),
    activo: Joi.number().required(),
    fecha_inicio_validez: Joi.date().required(),
    fecha_fin_validez: Joi.date().required(),
})