import Joi from "joi";

//Validacion para tbUsuarios
export const crearUsuario = Joi.object({
    id_nivel: Joi.number().required(),
    nombre: Joi.string().required(),
    carnet: Joi.string().required(),
    apellido: Joi.string().required(),
    correo: Joi.string().email().required(),
    clave: Joi.string().required(),
    estado: Joi.number().required(), //Se puso number por que no es un booleano en si, es un TinyInt
});

export const actualizarUsuario = Joi.object({
    nombre: Joi.string().required(),
    carnet: Joi.string().required(),
    apellido: Joi.string().required(),
    correo: Joi.string().email().required(),
    contrasena: Joi.string().required(),
    estado: Joi.number().required(), //Se puso number por que no es un booleano en si, es un TinyInt
});

//Validacion para tbNivelesUsuarios
export const nivelUsuario = Joi.object({
    nivel: Joi.string().required(),
})

