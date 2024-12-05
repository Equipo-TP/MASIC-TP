'use strict';

var express = require('express');
var proyectoController = require('../controllers/ProyectoController');

var api = express.Router();
var auth = require('../middlewares/authenticate').auth;

api.post('/registrar_proyecto', proyectoController.registrar_proyecto);
api.get('/listar_proyectos', proyectoController.listar_proyectos);
api.post('/ver_proyecto_por_id/:id', proyectoController.ver_proyecto_por_id);
api.put('/editar_proyecto_por_id/:id', proyectoController.editar_proyecto_por_id);
api.get('/gestionar_proyectos_tecnico', auth, proyectoController.listar_proyectos_por_tecnico);
api.delete('/eliminar_proyecto/:id', proyectoController.eliminar_proyecto);
module.exports = api;

