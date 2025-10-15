import Joi from "joi";

export const Materia = Joi.object({
    nombre_materia: Joi.string().required(),
})

export const MateriaCarrera = Joi.object({
    id_materia: Joi.number().required(),
    id_carrera: Joi.number().required(),
})