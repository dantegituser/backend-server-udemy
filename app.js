//Requires
//importacin de librerias para algo

//requerimos express
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
    //inicializams variables
var app = express();
//Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos', 'online');
})

//importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
//declaramos el midelware-se ejecuta antes  se hagan otras rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


//escuchar peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000  \x1b[0m', 'online');
})