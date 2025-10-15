export const validate = (scheme) => {
    return (req, res, next) => {
        const { error, value } = scheme.validate(req.body, {
            abortEarly: false, // Muestra todos los errores a la vez
            stripUnknown: true, // Elimina campos no definidos en el schema
            convert: true // Convierte tipos automáticamente
        });

        if (error) {
            // Formatear errores de manera legible
            const errores = error.details.map(detail => ({
                campo: detail.path.join('.'),
                mensaje: detail.message
            }));
            
            return res.status(400).json({
                message: "Errores de validación",
                errores
            });
        }

        req.body = value;
        next();
    };
};