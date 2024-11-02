'use strict';

var express = require('express');
var proyectoController = require('../controllers/ProyectoController');

var api = express.Router();
var auth = require('../middlewares/authenticate').auth;

api.post('/registro_proyecto', proyectoController.registro_proyecto);
api.get('/obtener_proyecto_por_presupuesto/:id', auth, proyectoController.obtener_proyecto_por_presupuesto);
api.get('/ver_proyecto_id/:id', auth, proyectoController.ver_proyecto_id);
api.put('/editar_proyecto/:id', auth, proyectoController.editar_proyecto);
api.delete('/eliminar_proyecto/:id', auth, proyectoController.eliminar_proyecto);
api.get('/listar_proyectos', auth, proyectoController.listar_proyectos);


module.exports = api;
