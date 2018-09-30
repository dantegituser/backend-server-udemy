//requerimos express
var express = require('express');
//inicializams variables
var app = express();


//Rutas
//recibe 3 parmetros
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
});

module.exports = app;