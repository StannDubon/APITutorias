const jwt = require('jsonwebtoken');


const generarAccessToken = (usuario) => {
    const payload = {
        id: usuario.id_usuario,
        carnet: usuario.carnet,
        nivel: usuario.nivel,
        tipo: 'access'
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN } // 15 minutos
    );
};


const generarRefreshToken = (usuario) => {
    const payload = {
        id: usuario.id_usuario,
        tipo: 'refresh'
    };

    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } // 7 días
    );
};


const verificarAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};


const verificarRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generarAccessToken,
    generarRefreshToken,
    verificarAccessToken,
    verificarRefreshToken
};