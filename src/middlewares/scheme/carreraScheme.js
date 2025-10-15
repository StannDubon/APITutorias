import Joi from "joi";

//Validacion para tbTiposCarrera
export const TipoCarrera = Joi.object({
    tipo_carrera: Joi.string().required(),
})

export const Carrera = Joi.object({
    nombre_carrera: Joi.string().required(),
    id_tipo_carrera: Joi.number().required(),
})
