const express = require('express');
const Usuario = require('../models/usuario');
const Paciente = require('../models/paciente');
const Doctor = require('../models/doctor');
const Receta = require('../models/receta');
const hbs = require('hbs');

//require('./hbs/helpers');


const bcrypt = require('bcrypt');
const _ = require('underscore');
const bodyParser = require('body-parser');
const app = express();

//hbs.registerPartials(__dirname + '/views/parciales');
app.set('view engine', 'hbs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

app.use((req, res, next)=>{
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
 res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
 res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
 next();
 
});


app.get('/home', function (req,res) {
        res.render('home')
})

//-->Consultar administradores:
app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    //mensaje: 'El nombre es necesario!',
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                ok: true,
                usuarios,
                conteo
            });
            res.render('signinAdministradores', {usuarios})
            /*res.json({
            ok: true,
            usuarios
            })*/
        })
})

//-->registro administradores:
app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        //role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.render('signinAdministradores',{message:"Hubo un error al guardar el admin"})
        }
        //usuarioDB.password = null;
        res.render('signinAdministradores',{succ:"Se guardó el admin exitosamente"})
    });
})

//editar
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                //mensaje: 'El nombre es necesario!',
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

//delete
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                //mensaje: 'El nombre es necesario!',
                err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no existe!',
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
})

//-->Registro paciente:
app.post('/paciente', function(req, res) {
    let body = req.body;

    let usuario = new Paciente({
        nombre: body.nombre,
        apellido: body.apellido,
        nss: body.nss,
        poliza: body.poliza
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.render('signinPacientes',{message:"Hubo un error al guardar el paciente"})
        }
        res.render('signinPacientes',{succ:"Se guardó el paciente exitosamente"})
    });
})

//-->Registro doctor:
app.post('/doctor', function(req, res) {
    let body = req.body;
    let usuario = new Doctor({
        nombre: body.nombre,
        apellido: body.apellido,
        especialidad: body.especialidad,
        cedula: body.cedula,
        equipo: body.equipo,
        universidad: body.universidad,
        afiliacion: body.afiliacion
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            /*return res.status(400).json({
                ok: false,
                mensaje: 'El nombre es necesario!',
                err
            })*/
            res.render('signinDoctores',{message:"Hubo un error al guardar el doctor"})
        }
        //usuarioDB.password = null;
        res.render('signinDoctores',{succ:"Se guardó el doctor exitosamente"})
    });
})

//-->Registro receta:
app.post('/receta', function(req, res) {
    let body = req.body;

    let usuario = new Receta({
        nombrePaciente: body.nombrePaciente,
        nombreMedico: body.nombreMedico,
        padecimiento: body.padecimiento,
        diagnostico: body.diagnostico,
        tratamiento: body.tratamiento,
        analisis: body.analisis,
        resultadoAnalisis: body.resultadoAnalisis,
        medicamento: body.medicamento,
        cedula: body.cedula
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El nombre es necesario!',
                err
            })
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
})

//-->Busqueda por cliente:
app.get('/doctor/:cedula', function(req, res) {
    let cedula = req.params.cedula;
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Receta.find({ cedula:cedula })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    //mensaje: 'El nombre es necesario!',
                    err
                })
            }

            Doctor.count({ estado: true }, (err, conteo) => {
                ok: true,
                usuarios,
                conteo
            });
            res.json({
                ok: true,
                usuarios
            });
        })
})

//-->Busqueda de cliente por receta:
app.get('/paciente/:nombrePaciente', function(req, res) {
    let nombrePaciente = req.params.nombrePaciente;
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Receta.find({ nombrePaciente:nombrePaciente })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    //mensaje: 'El nombre es necesario!',
                    err
                })
            }

            Doctor.count({ estado: true }, (err, conteo) => {
                ok: true,
                usuarios,
                conteo
            });
            res.json({
                ok: true,
                usuarios
            });
        })
})

//-->Administrador paciente:
app.post('/administrador-ingreso', function(req, res){

    var parametros = req.body;
    var nombre = parametros.nombre;
    var password = parametros.password;

    Usuario.findOne({nombre:nombre}, (error, seleccionUsuario)=>{

        if(error){
            console.log(error);
            //res.status(500).send({message:"Todo enviado, pero error...."});
            res.render('loginAdministrador',{message:"Internal server error"});
        }
        else{
            if(seleccionUsuario){
                if(password == seleccionUsuario.password){
                    //res.status(200).send({message:"Inicio de sesion correcto....."});
                    res.render('menuAdmin')
                }else{
                    res.render('loginAdministrador',{message:"No existe el usuario o se equivocó de contraseña"});
                    //res.status(404).send({message:"No encontrado...."});
                }
            }else{
                res.render('loginAdministrador',{message:"No existe el usuario o se equivocó de contraseña"});
                //res.status(404).send({message:"No encontrado...."});
            }
        }
    })
})

app.get('/doctor-ingreso', function(req, res){
    /*if(error){

            res.status(500).send({message:"Todo enviado, pero error...."});
        }
        else{*/
            res.render('loginDoctor')
        //}

})
app.get('/paciente-ingreso', function(req, res){
    /*if(error){

            res.status(500).send({message:"Todo enviado, pero error...."});
        }
        else{*/
            res.render('loginPaciente')
        //}

})
app.get('/administrador-ingreso', function(req, res){
    /*if(error){

            res.status(500).send({message:"Todo enviado, pero error...."});
        }
        else{*/
            res.render('loginAdministrador')
        //}

})
//-->Login doctor:
app.post('/doctor-ingreso', function(req, res){
    var parametros = req.body;
    var cedula = parametros.cedula;

    Doctor.findOne({cedula:cedula}, (error, seleccionUsuario)=>{
        if(error){
            //res.status(500).send({message:"Todo enviado, pero error...."});
            res.render('loginDoctor',{message:"Hubo un error para procesar la petición"})
        }
        else{
            if(!seleccionUsuario){
            //    res.status(404).send({message:"No encontrado...."});
                res.render('loginDoctor',{message:"No se encontró su cédula"})
            }else{
                res.status(200).send({message:"Inicio de sesion correcto....."});
                //res.render('doctor');
            }
        }
    })
})

//-->Login paciente:
app.post('/paciente-ingreso', function(req, res){
    var parametros = req.body;
    var nss = parametros.nss;
    //var password = parametros.password;
    Paciente.findOne({nss:nss}, (error, seleccionUsuario)=>{
        if(error){
            res.render('loginPaciente',{message:"Hubo un error para procesar la petición"})
        }
        else{
            if(!seleccionUsuario){
                //res.status(404).send({message:"No encontrado...."});
                res.render('loginPaciente',{message:"No se encontró su N.S.S"})
            }else{
                res.status(200).send({message:"Inicio de sesion correcto....."});
            }
        }
    })
})


//-->Desplegar pacientes:
app.get('/paciente', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);



    Paciente.find({ estado: true }, 'nombre apellido nss')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    //mensaje: 'El nombre es necesario!',
                    err
                })
            }
            Paciente.count({ estado: true }, (err, conteo) => {
                ok: true,
                usuarios,
                conteo
            });
            res.render('signinPacientes', {usuarios})
            /*res.json({
                ok: true,
                usuarios
            });*/
        })
})

app.get('/paciente-desplegar', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);



    Receta.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    //mensaje: 'El nombre es necesario!',
                    err
                })
            }
            Receta.count({ estado: true }, (err, conteo) => {
                ok: true,
                usuarios,
                conteo
            });
            res.render('signinPacientes', {usuarios})
            /*res.json({
                ok: true,
                usuarios
            });*/
        })
})

//->Desplegar doctores
app.get('/doctor', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Doctor.find({ estado: true }, 'nombre apellido')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    //mensaje: 'El nombre es necesario!',
                    err
                })
            }

            Doctor.count({ estado: true }, (err, conteo) => {
                ok: true,
                usuarios,
                conteo
            });
            res.render('signinDoctores', {usuarios})
            /*res.json({
                ok: true,
                usuarios
            });*/
        })
})

app.get('/usuario-desplegar', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email password')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    //mensaje: 'El nombre es necesario!',
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                ok: true,
                usuarios,
                conteo
            });
            //res.render('signinAdministradores', {usuarios})
            res.json({
            ok: true,
            usuarios
            })
        })
})

module.exports = app;