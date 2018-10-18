//requerimos express
var express = require('express');

//inicializams variables
var app = express();
var Hospital = require('../models/hospital');
// ya no se usa aquivar SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');
//obtener  todos los hospitales


//Rutas
//recibe 3 parmetros
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }
                //para contar el njumero de ususario listados
                Hospital.count({},(err,conteo)=>{
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });
                

            });
});



/*actualizar Hospital */
app.put('/:id',mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    /*verificar si un usuario existe con ese id */
    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + 'no existe',
                errors: { message: 'No existe un hospital coneste ID' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });


    });

});

/*crear nuebo hospital */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });

});

/*   borrar un hospital por el ID */
app.delete('/:id',mdAutenticacion.verificaToken, (req,res)=>{
    var id=req.params.id;
    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + 'no existe',
                errors: { message: 'No existe un hospital con este ID' }
            });
        }
        res.status(202).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;