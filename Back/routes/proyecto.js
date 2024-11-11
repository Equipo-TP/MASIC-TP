'use strict';

var express = require('express');
var proyectoController = require('../controllers/ProyectoController');

var api = express.Router();
var auth = require('../middlewares/authenticate').auth;

api.post('/registrar_proyecto', proyectoController.registrar_proyecto);
api.get('/listar_proyectos', proyectoController.listar_proyectos);
api.get('/listar_proyectos_por_tecnico/:tecnicoId', proyectoController.listar_proyectos_por_tecnico); 
api.post('/ver_proyecto_por_id/:id', proyectoController.ver_proyecto_por_id);
api.put('/editar_proyecto_por_id/:id', proyectoController.editar_proyecto_por_id);

module.exports = api;

