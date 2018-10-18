//requerimos express
var express = require('express');

//inicializams variables
var app = express();
var Medico = require('../models/medico');
// ya no se usa aquivar SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');
//obtener  todos los medicos


//Rutas
//recibe 3 parmetros
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }
                //para contar el njumero de ususario listados
                Medico.count({},(err,conteo)=>{
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });
                

            });
});



/*actualizar Medico */
app.put('/:id',mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    /*verificar si un usuario existe con ese id */
    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + 'no existe',
                errors: { message: 'No existe un medico coneste ID' }
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });


    });

});

/*crear nuebo medico */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });

});

/*   borrar un medico por el ID */
app.delete('/:id',mdAutenticacion.verificaToken, (req,res)=>{
    var id=req.params.id;
    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + 'no existe',
                errors: { message: 'No existe un medico con este ID' }
            });
        }
        res.status(202).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;