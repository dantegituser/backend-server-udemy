//requerimos express
var express = require('express');
//inicializams variables
var app = express();
const path = require('path');
//para la verificacion de si existe la imagen
const fs = require('fs');

//Rutas
//recibe 3 parmetros
//aqui se determina el path
app.get('/:tipo/:img', (req, res, next) => {
    //leemos las 2 variables q vienen
    var tipo = req.params.tipo;
    var img = req.params.img;

    //crear un path para verificar si la imagen existe
    //o mostrar una por defecto
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    //verificamos si la imagen existe en ese path
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }

});

module.exports = app;