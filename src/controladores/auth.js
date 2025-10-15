import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConnection } from '../db/conexion.js';
import sql from 'mssql';
import { JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, MAX_LOGIN_ATTEMPTS } from '../../config.js';
import {catchAsync, AppError} from '../middlewares/errorHandler.js'


const generarAccessToken = (usuario) => {
    const payload = {
        id: usuario.id_usuario,
        carnet: usuario.carnet,
        nivel: usuario.nivel,
        tipo: 'access' // Identificador para diferenciar de refresh token
    };
    
    return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: JWT_EXPIRES_IN // "15m" = 15 minutos
    });
};


const generarRefreshToken = (usuario) => {
    const payload = {
        id: usuario.id_usuario,
        carnet: usuario.carnet,
        tipo: 'refresh' // Identificador para diferenciar de access token
    };
    
    return jwt.sign(payload, JWT_REFRESH_SECRET, { 
        expiresIn: JWT_REFRESH_EXPIRES_IN // "7d" = 7 días
    });
};

export const login = catchAsync(async (req, res) => {
    try {
        const { carnet, clave } = req.body;

        // PASO 1: Validar que vengan los datos requeridos
        if (!carnet || !clave) {
            throw new AppError("Carnet y contraseña son requeridos", 400)
        }

        // Buscar usuario por carnet usando SQL directo
        const pool = await getConnection();
        const result = await pool.request()
            .input('carnet', sql.NVarChar, carnet)
            .query(`
                SELECT 
                    u.id_usuario, 
                    u.carnet, 
                    u.clave, 
                    u.nombre, 
                    u.apellido, 
                    u.correo, 
                    u.estado,
                    u.intentos_login,
                    u.fecha_bloqueo,
                    u.id_nivel,
                    n.nivel
                FROM tbUsuarios u
                INNER JOIN tbNivelesUsuarios n ON u.id_nivel = n.id_nivel
                WHERE u.carnet = @carnet
            `);

        if (result.recordset.length === 0) {
            throw new AppError("Credenciales invalidas", 401)
        }

        const usuario = result.recordset[0];

        // Verificar si está bloqueado PERMANENTEMENTE
        // (estado = 0 significa bloqueado por administrador)
        if (!usuario.estado) {
            throw new AppError("Usuario bloqueado permanentemente. Contacta al administrador", 403)
        }

        // PASO 4: Verificar BLOQUEO TEMPORAL por intentos fallidos
        const TIEMPO_BLOQUEO_MINUTOS = 30;
        
        if (usuario.intentos_login >= MAX_LOGIN_ATTEMPTS) {
            if (usuario.fecha_bloqueo) {
                // Calcular cuánto tiempo ha pasado desde el bloqueo
                const tiempoTranscurrido = (new Date() - new Date(usuario.fecha_bloqueo)) / (1000 * 60);
                
                if (tiempoTranscurrido < TIEMPO_BLOQUEO_MINUTOS) {
                    // Aún está bloqueado
                    const minutosRestantes = Math.ceil(TIEMPO_BLOQUEO_MINUTOS - tiempoTranscurrido);
                    throw new AppError(`Cuenta bloqueada temporalmente. Intenta en ${minutosRestantes} minutos`, 403)
                } else {
                    // Ya pasó el tiempo, resetear intentos
                    await pool.request()
                        .input('id_usuario', sql.Int, usuario.id_usuario)
                        .query(`
                            UPDATE tbUsuarios 
                            SET intentos_login = 0, fecha_bloqueo = NULL 
                            WHERE id_usuario = @id_usuario
                        `);
                    usuario.intentos_login = 0;
                }
            } else {
                // Primera vez que alcanza el máximo, establecer fecha
                    await pool.request()
                    .input('id_usuario', sql.Int, usuario.id_usuario)
                    .query(`
                        UPDATE tbUsuarios 
                        SET fecha_bloqueo = GETDATE() 
                        WHERE id_usuario = @id_usuario
                    `);
                
                throw new AppError(`Cuenta bloqueada por ${TIEMPO_BLOQUEO_MINUTOS} minutos debido a múltiples intentos fallidos`, 403)
            }
        }

        // Verificar la contraseña con bcrypt
        // bcrypt.compare compara la contraseña en texto plano con el hash
        const passwordValida = await bcrypt.compare(clave, usuario.clave);

        if (!passwordValida) {
            // CONTRASEÑA INCORRECTA: Incrementar intentos
            await pool.request()
                .input('id_usuario', sql.Int, usuario.id_usuario)
                .query(`
                    UPDATE tbUsuarios 
                    SET intentos_login = intentos_login + 1 
                    WHERE id_usuario = @id_usuario
                `);

            const intentosRestantes = MAX_LOGIN_ATTEMPTS - (usuario.intentos_login + 1);

            throw new AppError('Credenciales inválidas', 401)
        }

        // login exitoso Resetear intentos fallidos
        await pool.request()
            .input('id_usuario', sql.Int, usuario.id_usuario)
            .query(`
                UPDATE tbUsuarios 
                SET intentos_login = 0, fecha_bloqueo = NULL 
                WHERE id_usuario = @id_usuario
            `);

        // Generar los dos tokens
        const accessToken = generarAccessToken(usuario);
        const refreshToken = generarRefreshToken(usuario);

        // Guardar el refresh token en la base de datos
        const fechaExpiracion = new Date();
        fechaExpiracion.setDate(fechaExpiracion.getDate() + 7); // +7 días

        await pool.request()
            .input('id_usuario', sql.Int, usuario.id_usuario)
            .input('token', sql.NVarChar(sql.MAX), refreshToken)
            .input('fecha_expiracion', sql.DateTime, fechaExpiracion)
            .input('activo', sql.Bit, 1)
            .query(`
                INSERT INTO tbRefreshTokens (id_usuario, token, fecha_expiracion, activo, fecha_creacion)
                VALUES (@id_usuario, @token, @fecha_expiracion, @activo, GETDATE())
            `);

        // Retornar respuesta exitosa
        res.json({
            mensaje: 'Login exitoso',
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Error al iniciar sesión",
            detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export const renovarToken = catchAsync(async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Validar que venga el refresh token
        if (!refreshToken) {
            throw new AppError("Refresh token es requerido", 400)
        }

        // Verificar el token con JWT
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        } catch (error) {
            throw new AppError("Refresh token inválido o expirado", 401)
        }

        // Verificar que sea un refresh token (no un access token)
        if (decoded.tipo !== 'refresh') {
            throw new AppError("El token proporcionado no es un refresh token", 401)
        }

        // Verificar que el token exista en la BD y esté activo
        const pool = await getConnection();
        const tokenResult = await pool.request()
            .input('token', sql.NVarChar(sql.MAX), refreshToken)
            .input('id_usuario', sql.Int, decoded.id)
            .query(`
                SELECT 
                    id_refresh_token,
                    id_usuario,
                    fecha_expiracion,
                    estado
                FROM tbRefreshTokens
                WHERE token = @token 
                    AND id_usuario = @id_usuario
                    AND estado = 1
            `);

        if (tokenResult.recordset.length === 0) {
            throw new AppError("Refresh token no válido o ha sido revocado", 401)
        }

        const tokenData = tokenResult.recordset[0];

        // Verificar que no haya expirado
        if (new Date() > new Date(tokenData.fecha_expiracion)) {
            // Desactivar el token expirado
            await pool.request()
                .input('id_refresh_token', sql.Int, tokenData.id_refresh_token)
                .query(`
                    UPDATE tbRefreshTokens 
                    SET estado = 0 
                    WHERE id_refresh_token = @id_refresh_token
                `);

            throw new AppError("Refresh token expirado. Inicia sesión nuevamente", 401)
        }

        // Obtener datos actuales del usuario
        const userResult = await pool.request()
            .input('id_usuario', sql.Int, decoded.id)
            .query(`
                SELECT 
                    u.id_usuario,
                    u.carnet,
                    u.estado,
                    n.nivel
                FROM tbUsuarios u
                INNER JOIN tbNivelesUsuarios n ON u.id_nivel = n.id_nivel
                WHERE u.id_usuario = @id_usuario
            `);

        if (userResult.recordset.length === 0) {
            throw new AppError("Usuario no encontrado", 404)
        }

        const usuario = userResult.recordset[0];

        // Verificar que el usuario siga activo
        if (!usuario.estado) {
            // Revocar el refresh token
            await pool.request()
                .input('id_refresh_token', sql.Int, tokenData.id_refresh_token)
                .query(`
                    UPDATE tbRefreshTokens 
                    SET activo = 0 
                    WHERE id_refresh_token = @id_refresh_token
                `);

                throw  new AppError("Usuario bloqueado", 403)
        }

        // Generar NUEVO access token
        const nuevoAccessToken = generarAccessToken(usuario);

        // Retornar el nuevo access token
        res.json({
            mensaje: 'Token renovado exitosamente',
            accessToken: nuevoAccessToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Error al renovar token"
        });
    }
});

export const logout = catchAsync(async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError("Refresh token es requerido", 400)
        }

        const pool = await getConnection();
        const result = await pool.request()
            .input('token', sql.NVarChar(sql.MAX), refreshToken)
            .query(`
                UPDATE tbRefreshTokens 
                SET activo = 0, fecha_revocacion = GETDATE()
                WHERE token = @token AND activo = 1
            `);

        if (result.rowsAffected[0] === 0) {
            throw  new AppError("Refresh token no encontrado o ya fue revocado", 404)
        }

        res.json({
            mensaje: 'Sesión cerrada exitosamente'
        });

    } catch (error) {
        console.log(error);
        throw new AppError("Error al cerrar sesión", 500)
    }
});

export const logoutTodos = catchAsync(async (req, res) => {
    try {
        // req.usuario viene del middleware verificarToken
        const idUsuario = req.usuario.id;

        const pool = await getConnection();
        await pool.request()
            .input('id_usuario', sql.Int, idUsuario)
            .query(`
                UPDATE tbRefreshTokens 
                SET activo = 0, fecha_revocacion = GETDATE()
                WHERE id_usuario = @id_usuario AND activo = 1
            `);

        res.json({
            mensaje: 'Todas las sesiones han sido cerradas'
        });

    } catch (error) {
        console.log(error);
        throw new AppError("Error al cerrar todas las sesiones", 500)
    }
});