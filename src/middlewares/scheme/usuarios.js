import Joi from "joi";

export const crearUsuario = Joi.object({
    id_nivel: Joi.number().required(),
    nombre: Joi.string().required(),
    carnet: Joi.string().required(),
    apellido: Joi.string().required(),
    correo: Joi.string().email().required(),
    clave: Joi.string().required(),
    estado: Joi.number().required(),
});

export const actualizarUsuario = Joi.object({
    nombre: Joi.string().required(),
    carnet: Joi.string().required(),
    apellido: Joi.string().required(),
    correo: Joi.string().email().required(),
    contrasena: Joi.string().required(),
    tipoUsuario: Joi.string().required(),
    estado: Joi.boolean().required(),
});
