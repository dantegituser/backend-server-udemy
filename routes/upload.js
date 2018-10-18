//requerimos express
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
//inicializams variables
var app = express();
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');




app.use(fileUpload());

//Rutas
//recibe 3 parmetros
app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;


    //tipos de colecciones
    var tiposValidos = ['hospitales','medicos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no es válida',
            errors: {message: 'tipo de coleccion no es válida'}
        }); 
    }


    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: {message: 'Debe seleccionar una imagen'}
        });    
    }

    //validaciones, obteenr nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    
    //solo estas extensiones aceptamos
    var extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];
    if(extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: {message: 'Las extensiones válidas son '+ extensionesValidas.join(', ')}
        }); 
    }
    //nombre de archivo personallizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //mover el archivo de un temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivos',
                errors: err
            });    
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
        /*res.status(200).json({
            ok: true,
            mensaje: 'movido',
            extensionArchivo: extensionArchivo
        })*/
        
    })

function subirPorTipo(tipo, id, nombreArchivo, res){
    if(tipo === 'usuarios'){
        Usuario.findById(id, (err, usuario)=>{
            //validacio si no hay ese id
            if(!usuario){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'usuario no existe',
                    errors: {message: 'usuario no existe'}
                });
            }
            //path viejo de la imagen
            var pathViejo = '.uploads/usuarios/'+ usuario.img;

            //si ya existe elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de usuario actualizada',
                    usuarioActualizado: usuarioActualizado
                });
            });
        });
    }
    if(tipo === 'medicos'){
        Medico.findById(id, (err, medico)=>{
             //validacio si no hay ese id
             if(!medico){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'medico no existe',
                    errors: {message: 'medico no existe'}
                });
            }
            //path viejo de la imagen
            var pathViejo = '.uploads/medicos/'+ medico.img;

            //si ya existe elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de medico actualizada',
                    medicoActualizado: medicoActualizado
                });
            });
        });
    }
    if(tipo === 'hospitales'){
        Hospital.findById(id, (err, hospital)=>{
             //validacio si no hay ese id
             if(!hospital){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'hospital no existe',
                    errors: {message: 'hospital no existe'}
                });
            }
            //path viejo de la imagen
            var pathViejo = '.uploads/hospitales/'+ hospital.img;

            //si ya existe elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de hospital actualizada',
                    hospitalActualizado: hospitalActualizado
                });
            });
        });
    }
}
});




module.exports = app;