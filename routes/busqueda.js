//requerimos express
var express = require('express');
//inicializams variables
var app = express();
//importamos el modelo de los hospitales para poder usarlos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//Rutas
//recibe 3 parmetros
// ========================
//  busqueda por coleccion
// ========================
app.get('/coleccion/:tabla/:busqueda', (req,res)=>{

    //recibir los 2 parametros del url
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var promesa;
    var regex = new RegExp(busqueda, 'i');

    switch(tabla){
        case 'usuarios': 
        promesa = buscarUsuarios( busqueda, regex);
        break;

        case 'hospitales': 
        promesa = buscarHospitales( busqueda, regex);
        break;

        case 'medicos': 
        promesa = buscarMedicos( busqueda, regex);
        break;

        default :
        return res.status(400).json({
            ok: false,
            mensaje : 'Los tipos solo son medicos, usuarios y hospitales',
            error :{ message : 'tipo de tabla/coleccion no valido'}
        });
    }
    promesa.then(data =>{
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});


// ========================
//  busqueda en todo
// ========================
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ])
    .then(respuestas=>{
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });

    
});

function buscarHospitales(busqueda,regex){
    return new Promise((resolve,reject)=>{
        Hospital.find({nombre:regex})
            .populate('usuario', 'nombre email')
            .exec((err,hospitales)=>{
            if(err){
                reject('Error al cargar hospitales',err);
            }else{
                resolve(hospitales);
            }
            
        }); 
    });
}
function buscarMedicos(busqueda,regex){
    return new Promise((resolve,reject)=>{
        Medico.find({nombre:regex})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err,medicos)=>{
            if(err){
                reject('Error al cargar medicos',err);
            }else{
                resolve(medicos);
            }
            
        }); 
    });
}
function buscarUsuarios(busqueda,regex){
    return new Promise((resolve,reject)=>{
        Usuario.find({},'nombre email role')
        .or([{'nombre': regex,},{'email': regex}])
        .exec((err,usuarios)=>{
            if(err){
            reject('error al cargar usuarios',err);
            }else{
                resolve(usuarios)
            }
        }); 
    });
}

module.exports = app;