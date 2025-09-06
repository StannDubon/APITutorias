// Dependencias para el proyecto
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const pruebas = require('./modulos/pruebas/rutas');

const app = express();

app.set('port', config.app.port);

//Rutas
app.use('/api/pruebas', pruebas);

module.exports = app;
