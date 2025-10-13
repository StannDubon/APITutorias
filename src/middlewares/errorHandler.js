export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Error que esperábamos
        
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err, req, res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Error interno del servidor';

}

//ERRORES SQL

const handlerSQLError = (err, req, res, next) => {
    let message = 'Error de la base de datos';
    let statusCode = 400;

    // Códigos de error comunes de SQL Server
    switch (err.number) {
        case 2627: // Violación de UNIQUE constraint
            message = 'Este registro ya existe';
            statusCode = 409; // Conflict
            break;
        case 547: // Violación de FOREIGN KEY constraint
            message = 'No se puede eliminar este registro porque está siendo usado';
            statusCode = 409;
            break;
        case 515: // Campo NOT NULL sin valor
            message = 'Faltan campos requeridos';
            statusCode = 400;
            break;
        case 8152: // String truncado (dato muy largo)
            message = 'Uno de los campos es demasiado largo';
            statusCode = 400;
            break;
        case 245: // Error de conversión de tipos
            message = 'Tipo de dato incorrecto';
            statusCode = 400;
            break;
        default:
            message = 'Error en la base de datos';
            statusCode = 500;
    }
    return new AppError(message, statusCode);
};

//ERRORES JOI

const handleJoiError = (err) => {
    // Extraer mensajes de error de Joi
    const errors = err.details.map(detail => ({
        campo: detail.path[0],
        mensaje: detail.message
    }));

    const message = `Datos inválidos: ${errors.map(e => e.mensaje).join('. ')}`;
    return new AppError(message, 400);
};

//ERRORES JWT

const handleJWTError = () => {
    return new AppError('Token inválido. Inicia sesión nuevamente', 401);
};

const handleJWTExpiredError = () => {
    return new AppError('Tu sesión ha expirado. Inicia sesión nuevamente', 401);
};

export const notFound = (req, res, next) => {
    const error = new AppError(
        `No se encontró la ruta ${req.originalUrl}`, 
        404
    );
    next(error);
};

export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
