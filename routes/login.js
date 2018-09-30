//requerimos express
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//inicializams variables
var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;
//console.log(SEED);
app.post('/',(req,res)=>{
    var body = req.body;
    Usuario.findOne({email:body.email},(err,usuarioDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas-email',
                errors: err
            });
        }
        if(bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas-password',
                errors: err
            });
        }
        //crear token
        usuarioDB.password = ':)';
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn:14400}); //4 horas
        console.log(SEED);
        res.status(202).json({
            ok: true,
            usuario : usuarioDB,
            token : token,
            id : usuarioDB.id
        });
    })
    
})


module.exports = app;