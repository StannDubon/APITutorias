const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');

const login = async (req, res) => {
    try {
        const { carnet, clave } = req.body;

        if (!carnet || !clave) {
            return res.status(400).json({
                error: 'Carnet y contraseña son requeridos'
            });
        }

        const pool = await sql.connect();
        const result = await pool.request()
            .input('carnet', sql.NVarChar, carnet)
            .query(`
                SELECT u.id_usuario, u.carnet, u.clave, u.nombre, u.apellido, u.correo, u.estado,u.intentos_login,u.id_nivel,n.nivel
                FROM tbUsuarios u
                INNER JOIN tbNivelesUsuarios n ON u.id_nivel = n.id_nivel
                WHERE u.carnet = @carnet
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        const usuario = result.recordset[0];

        if (!usuario.estado) {
            return res.status(403).json({
                error: 'Usuario bloqueado. Contacta al administrador'
            });
        }

        if (usuario.intentos_login >= process.env.MAX_LOGIN_ATTEMPTS) {
            // Bloquear la cuenta
            await pool.request()
                .input('id_usuario', sql.Int, usuario.id_usuario)
                .query(`
                    UPDATE tbUsuarios 
                    SET estado = 0 
                    WHERE id_usuario = @id_usuario
                `);

            return res.status(403).json({
                error: 'Cuenta bloqueada por múltiples intentos fallidos. Contacta al administrador'
            });
        }

        // 6. Verificar la contraseña
        const passwordValida = await bcrypt.compare(clave, usuario.clave);

        if (!passwordValida) {
            // Incrementar intentos fallidos
            await pool.request()
                .input('id_usuario', sql.Int, usuario.id_usuario)
                .query(`
                    UPDATE tbUsuarios 
                    SET intentos_login = intentos_login + 1 
                    WHERE id_usuario = @id_usuario
                `);

            const intentosRestantes = process.env.MAX_LOGIN_ATTEMPTS - (usuario.intentos_login + 1);

            return res.status(401).json({
                error: 'Credenciales inválidas',
                intentosRestantes: intentosRestantes
            });
        }

        await pool.request()
            .input('id_usuario', sql.Int, usuario.id_usuario)
            .query(`
                UPDATE tbUsuarios 
                SET intentos_login = 0 
                WHERE id_usuario = @id_usuario
            `);

        const accessToken = generarAccessToken(usuario);
        const refreshToken = generarRefreshToken(usuario);

        res.json({
            mensaje: 'Login exitoso',
            usuario: {
                id: usuario.id_usuario,
                carnet: usuario.carnet,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                nivel: usuario.nivel
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error en el servidor'
        });
    }
};

//Bloqueo de usuario

const TIEMPO_BLOQUEO_MINUTOS = 30;

if (usuario.intentos_login >= process.env.MAX_LOGIN_ATTEMPTS) {
    if (usuario.fecha_bloqueo) {
        const tiempoTranscurrido = (new Date() - new Date(usuario.fecha_bloqueo)) / (1000 * 60);
        
        if (tiempoTranscurrido < TIEMPO_BLOQUEO_MINUTOS) {
            const minutosRestantes = Math.ceil(TIEMPO_BLOQUEO_MINUTOS - tiempoTranscurrido);
            return res.status(403).json({
                error: `Cuenta bloqueada temporalmente. Intenta en ${minutosRestantes} minutos`
            });
        } else {
            // Resetear intentos después del tiempo de bloqueo
            await pool.request()
                .input('id_usuario', sql.Int, usuario.id_usuario)
                .query(`
                    UPDATE tbUsuarios 
                    SET intentos_login = 0, fecha_bloqueo = NULL 
                    WHERE id_usuario = @id_usuario
                `);
        }
    } else {
        // Primera vez que se bloquea, guardar fecha
        await pool.request()
            .input('id_usuario', sql.Int, usuario.id_usuario)
            .query(`
                UPDATE tbUsuarios 
                SET fecha_bloqueo = GETDATE() 
                WHERE id_usuario = @id_usuario
            `);
        
        return res.status(403).json({
            error: `Cuenta bloqueada por ${TIEMPO_BLOQUEO_MINUTOS} minutos`
        });
    }
}

// controllers/authController.js

const renovarToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                error: 'Refresh token no proporcionado'
            });
        }

        // 1. Verificar que el refresh token es válido
        const decoded = verificarRefreshToken(refreshToken);

        if (!decoded) {
            return res.status(403).json({
                error: 'Refresh token inválido o expirado'
            });
        }

        // 2. Verificar que el token no está revocado (si usas tabla)
        const pool = await sql.connect();
        const tokenResult = await pool.request()
            .input('token', sql.NVarChar, refreshToken)
            .input('id_usuario', sql.Int, decoded.id)
            .query(`
                SELECT * FROM tbRefreshTokens
                WHERE token = @token 
                AND id_usuario = @id_usuario
                AND revocado = 0
                AND fecha_expiracion > GETDATE()
            `);

        if (tokenResult.recordset.length === 0) {
            return res.status(403).json({
                error: 'Refresh token inválido o revocado'
            });
        }

        // 3. Obtener información actualizada del usuario
        const usuarioResult = await pool.request()
            .input('id_usuario', sql.Int, decoded.id)
            .query(`
                SELECT 
                    u.id_usuario,
                    u.carnet,
                    u.nombre,
                    u.apellido,
                    u.estado,
                    n.nivel
                FROM tbUsuarios u
                INNER JOIN tbNivelesUsuarios n ON u.id_nivel = n.id_nivel
                WHERE u.id_usuario = @id_usuario
            `);

        if (usuarioResult.recordset.length === 0 || !usuarioResult.recordset[0].estado) {
            return res.status(403).json({
                error: 'Usuario no encontrado o inactivo'
            });
        }

        const usuario = usuarioResult.recordset[0];

        // 4. Generar nuevo access token
        const nuevoAccessToken = generarAccessToken(usuario);

        // 5. Opcionalmente, generar nuevo refresh token (rotación)
        const nuevoRefreshToken = generarRefreshToken(usuario);

        // 6. Revocar el refresh token viejo y guardar el nuevo
        await pool.request()
            .input('token_viejo', sql.NVarChar, refreshToken)
            .query(`
                UPDATE tbRefreshTokens 
                SET revocado = 1 
                WHERE token = @token_viejo
            `);

        const fechaExpiracion = new Date();
        fechaExpiracion.setDate(fechaExpiracion.getDate() + 7);

        await pool.request()
            .input('id_usuario', sql.Int, usuario.id_usuario)
            .input('token', sql.NVarChar, nuevoRefreshToken)
            .input('fecha_expiracion', sql.DateTime, fechaExpiracion)
            .query(`
                INSERT INTO tbRefreshTokens (id_usuario, token, fecha_expiracion)
                VALUES (@id_usuario, @token, @fecha_expiracion)
            `);

        // 7. Responder con los nuevos tokens
        res.json({
            accessToken: nuevoAccessToken,
            refreshToken: nuevoRefreshToken
        });

    } catch (error) {
        console.error('Error al renovar token:', error);
        res.status(500).json({
            error: 'Error al renovar token'
        });
    }
};

// Logout: Revocar refresh token
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                error: 'Refresh token no proporcionado'
            });
        }

        const pool = await sql.connect();
        await pool.request()
            .input('token', sql.NVarChar, refreshToken)
            .query(`
                UPDATE tbRefreshTokens 
                SET revocado = 1 
                WHERE token = @token
            `);

        res.json({ mensaje: 'Logout exitoso' });

    } catch (error) {
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
};