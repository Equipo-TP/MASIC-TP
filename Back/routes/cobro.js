'use strict';

var express = require('express');
var ProyectoController = require('../controllers/ProyectoController');

var api = express.Router(); // Aquí defines el router correctamente como 'api'

api.post('/registrar', ProyectoController.registrar_proyecto);
api.get('/listar', ProyectoController.listar_proyectos);
api.get('/ver/:id', ProyectoController.ver_proyecto_por_id);
api.put('/editar/:id', ProyectoController.editar_proyecto_por_id);
api.delete('/eliminar/:id', ProyectoController.eliminar_proyecto);
api.post('/actualizarCobros/:id', ProyectoController.actualizar_cobros_proyecto);
api.get('/verPagos/:id', ProyectoController.ver_pagos_proyecto);

module.exports = api; // Exportas 'api', que es tu router
