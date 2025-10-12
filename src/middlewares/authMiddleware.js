const { verificarAccessToken } = require('../utils/tokenUtils');

const autenticar = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Token no proporcionado'
            });
        }

        const decoded = verificarAccessToken(token);

        if (!decoded) {
            return res.status(403).json({
                error: 'Token inválido o expirado'
            });
        }

        req.usuario = decoded;  

        next();

    } catch (error) {
        return res.status(500).json({
            error: 'Error al verificar token'
        });
    }
};

const autorizar = (nivelesPermitidos) => {
    return (req, res, next) => {
        try {
            const nivelUsuario = req.usuario.nivel;

            if (!nivelesPermitidos.includes(nivelUsuario)) {
                return res.status(403).json({
                    error: 'No tienes permisos para realizar esta acción'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                error: 'Error al verificar permisos'
            });
        }
    };
};

module.exports = { autenticar, autorizar };