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

//importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos', 'online');
})

/* server index config, esta libreria no se usa solo es para aprender y se va a comentar*/
//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'))
//app.use('/uploads', serveIndex(__dirname + '/uploads'));

//declaramos el midelware-se ejecuta antes  se hagan otras rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/login', loginRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
//esta seimpre debe ser la ultima ruta
app.use('/', appRoutes);


//escuchar peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000  \x1b[0m', 'online');
})