import Joi from "joi";

export const DiasSemana = Joi.object({
    dia_semana: Joi.string().required(),
})
