import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config.js';
import { getConnection } from '../db/conexion.js';
import sql from 'mssql';

export const verificarToken = async (req, res, next) => {
    try {
        // Obtener el header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: 'Token no proporcionado. Incluye el header: Authorization: Bearer TOKEN'
            });
        }

        // Verificar formato "Bearer TOKEN"
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Formato de token inválido. Usa: Bearer TOKEN'
            });
        }

        // Extraer el token (quitar "Bearer ")
        const token = authHeader.substring(7);

        // Verificar el token con JWT
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'Token expirado. Usa el refresh token para obtener uno nuevo'
                });
            }
            
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    error: 'Token inválido'
                });
            }

            throw error;
        }

        // Verificar que sea un ACCESS token
        if (decoded.tipo !== 'access') {
            return res.status(401).json({
                error: 'Debes usar un access token, no un refresh token'
            });
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
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        const usuario = result.recordset[0];

        if (!usuario.estado) {
            return res.status(403).json({
                error: 'Usuario bloqueado. Contacta al administrador'
            });
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
        res.status(500).json({
            message: 'Error al verificar el token'
        });
    }
};

export const verificarNivel = (nivelesPermitidos) => {
    return (req, res, next) => {
        // Verificar que el usuario esté autenticado
        if (!req.usuario) {
            return res.status(401).json({
                error: 'Usuario no autenticado. Usa primero el middleware verificarToken'
            });
        }

        // Verificar si el nivel del usuario está en los permitidos
        if (!nivelesPermitidos.includes(req.usuario.nivel)) {
            return res.status(403).json({
                error: 'No tienes permisos para realizar esta acción',
                nivelRequerido: nivelesPermitidos,
                tuNivel: req.usuario.nivel
            });
        }

        // El usuario tiene el nivel correcto
        next();
    };
};
