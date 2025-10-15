import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config.js';
import { getConnection } from '../db/conexion.js';
import sql from 'mssql';
import { catchAsync, AppError } from './errorHandler.js';

export const verificarToken = catchAsync(async (req, res, next) => {
    try {
        // Obtener el header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError('Token no proporcionado. Incluye el header: Authorization: Bearer TOKEN', 401);
        }

        // Verificar formato "Bearer TOKEN"
        if (!authHeader.startsWith('Bearer ')) {
            throw new AppError('Formato de token inválido. Usa: Bearer TOKEN', 401);
        }

        // Extraer el token (quitar "Bearer ")
        const token = authHeader.substring(7);

        // Verificar el token con JWT
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new AppError('Token expirado. Usa el refresh token para obtener uno nuevo', 401);
            }
            
            if (error.name === 'JsonWebTokenError') {
                throw new AppError('Token inválido', 401);
            }

            throw error;
        }

        // Verificar que sea un ACCESS token
        if (decoded.tipo !== 'access') {
            throw new AppError('Debes usar un access token, no un refresh token', 401);
        }

        // Verificar que el usuario exista y esté activo
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_usuario', sql.Int, decoded.id)
            .query(`
                SELECT 
                    u.id_usuario,
                    u.carnet,
                    u.nombre,
                    u.apellido,
                    u.correo,
                    u.estado,
                    u.id_nivel,
                    n.nivel
                FROM tbUsuarios u
                INNER JOIN tbNivelesUsuarios n ON u.id_nivel = n.id_nivel
                WHERE u.id_usuario = @id_usuario
            `);

        if (result.recordset.length === 0) {
            throw new AppError('Usuario no encontrado', 404);
        }

        const usuario = result.recordset[0];

        if (!usuario.estado) {
            throw new AppError('Usuario bloqueado. Contacta al administrador', 403);
        }

        // Adjuntar datos del usuario al request
        // Ahora TODOS los controladores pueden acceder a req.usuario
        req.usuario = {
            id: usuario.id_usuario,
            carnet: usuario.carnet,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            nivel: usuario.nivel,
            id_nivel: usuario.id_nivel
        };

        // Continuar con el siguiente middleware o controlador
        next();

    } catch (error) {
        console.log(error);
       throw new AppError('Error al verificar el token', 500);  
    }
});

export const verificarNivel = (nivelesPermitidos) => {
    return (req, res, next) => {
        // Verificar que el usuario esté autenticado
        if (!req.usuario) {
            throw new AppError('Usuario no autenticado. Usa primero el middleware verificarToken', 401);
        }

        // Verificar si el nivel del usuario está en los permitidos
        if (!nivelesPermitidos.includes(req.usuario.nivel)) {
            throw new AppError('No tienes permisos para realizar esta acción', 403);
        }

        // El usuario tiene el nivel correcto
        next();
    };
};
