const express = require('express');
const router = express.Router(); 
const respuesta = require('../../red/respuestas');

router.get('/hola', (req, res) => {
    respuesta.success(req, res, 'Hola mundo', 200);
});

router.get('/hola', (req, res) => {
    res.send('Hola mundos');
}); 

module.exports = router;