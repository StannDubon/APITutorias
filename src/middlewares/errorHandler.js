export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}


export const errorHandler = (err, req, res, next) => {
    // Valores por defecto
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Error interno del servidor';

    // Si es error de SQL
    if (err.number) {
        err = handleSQLError(err);
    }

    // Si es error de Joi
    if (err.isJoi) {
        err = handleJoiError(err);
    }

    // Si es error de JWT
    if (err.name === 'JsonWebTokenError') {
        err = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
        err = handleJWTExpiredError();
    }

    // Responder con el error
    res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            error: err 
        })
    });
};

// Manejador de errores SQL
const handleSQLError = (err) => {
    let message = 'Error de la base de datos';
    let statusCode = 400;

    switch (err.number) {
        case 2627: // Violación de UNIQUE constraint
            message = 'Este registro ya existe (dato duplicado)';
            statusCode = 409;
            break;
        case 547: // Violación de FOREIGN KEY constraint
            message = 'No se puede eliminar/modificar porque está siendo usado por otro registro';
            statusCode = 409;
            break;
        case 515: // Campo NOT NULL sin valor
            message = 'Faltan campos requeridos';
            statusCode = 400;
            break;
        case 8152: // String truncado
            message = 'Uno de los campos es demasiado largo';
            statusCode = 400;
            break;
        case 245: // Error de conversión
            message = 'Tipo de dato incorrecto';
            statusCode = 400;
            break;
        case 207: // Columna inválida
            message = 'Campo inválido en la base de datos';
            statusCode = 400;
            break;
        default:
            message = err.message || 'Error en la base de datos';
            statusCode = 500;
    }
    
    return new AppError(message, statusCode);
};

// Manejador de errores Joi
const handleJoiError = (err) => {
    const errors = err.details.map(detail => ({
        campo: detail.path[0],
        mensaje: detail.message
    }));
    const message = `Datos inválidos: ${errors.map(e => e.mensaje).join('. ')}`;
    return new AppError(message, 400);
};

// Manejadores JWT
const handleJWTError = () => {
    return new AppError('Token inválido. Inicia sesión nuevamente', 401);
};

const handleJWTExpiredError = () => {
    return new AppError('Tu sesión ha expirado. Inicia sesión nuevamente', 401);
};

// Middleware para rutas no encontradas
export const notFound = (req, res, next) => {
    const error = new AppError(
        `No se encontró la ruta ${req.originalUrl}`, 
        404
    );
    next(error);
};

// Wrapper para async/await
export const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

