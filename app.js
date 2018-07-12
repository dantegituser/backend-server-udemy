//Requires
//importacin de librerias para algo

//requerimos express
var express = require('express');
var mongoose = require('mongoose');
//inicializams variables
var app = express();

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos', 'online');
})


//Rutas
//recibe 3 parmetros
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
})

//escuchar peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000  \x1b[0m', 'online');
})