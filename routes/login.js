var express = require('express');
var bcrypt = require('bcryptjs'); // https://github.com/dcodeIO/bcrypt.js
var jwt = require('jsonwebtoken'); // https://github.com/auth0/node-jsonwebtoken
 
var SEED = require('../config/config').SEED;
var CADUCIDAD_TOKEN = require('../config/config').CADUCIDAD_TOKEN;
 
var app = express();
 
var Usuario = require('../models/usuario');
 
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
// const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
 
//=============================
// Autenticación de Google
//=============================
app.post('/google', async (req, res) => {
    let token = req.body.token;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
    }).catch(e => {
        return res.status(403).json({
            ok: false,
            mensaje: 'Token no válido',
            err: e
        });
    })
 
    const googleUser = ticket.getPayload();
 
    /* res.status(200).json({
        ok: true,
        ticket: googleUser,
        email: googleUser.email
    }) */
 
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        //validamos error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        //si existe usuario db queire decir q existe ne la bnase de datos
        if (usuarioDB) {
            //si el usuario no ha sido autenticado por google se acaba
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                console.log('No existe usuario');
                
 
                let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }
        } else {
            // Si el usuario NO EXISTE en nuestra base de datos va este codigo
            //hasy q crear el usuario
            //creamos instancia del usuario con todos sus valores
            //se obtiene de google user
            let usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.picture;
            usuario.google = true;
            usuario.password = ':)';
            //grabamos el usurario en la db
            usuario.save((err, usuarioDB) => {
                //si hay error al grabar mandamos mensaje
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: CADUCIDAD_TOKEN });
                //var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }); // 4 horas
 
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            });
        }
    });
});
 
 
//=============================
// Autenticación normal
//=============================
app.post('/', (req, res) => {
 
    var body = req.body;
 
    // Verifico que existe el usuario con ese correo
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
 
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
 
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }
 
        // Si la contraseña no coincide entre el password enviado con el password de BD
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }
 
        // Crear un token (en este punto el correo y el password ya son correctos)
        usuarioBD.password = ':D';
 
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: CADUCIDAD_TOKEN });
 
        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        });
 
    });
 
});
 
 
// Lo exporto para ser usado en app.js
module.exports = app;