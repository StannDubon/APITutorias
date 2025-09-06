require('dotenv').config();

module.exports = {

    //Configuraciones
    app: {
        port: process.env.PORT || 3000,
    },

    //Conexion sql momentanea
    mysql: {
        host: process.env.HOST || 'localhost',
        user: process.env.USER || 'root',
        password: process.env.PASSWORD || '',
        database: process.env.DATABASE || 'sistema_tutorias',
    }
}