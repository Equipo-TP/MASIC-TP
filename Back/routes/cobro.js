'use strict';

var express = require('express');
var proyectoController = require('../controllers/ProyectoController');

var api = express.Router();

router.post('/registrar', ProyectoController.registrar_proyecto);
router.get('/listar', ProyectoController.listar_proyectos);
router.get('/ver/:id', ProyectoController.ver_proyecto_por_id);
router.put('/editar/:id', ProyectoController.editar_proyecto_por_id);
router.delete('/eliminar/:id', ProyectoController.eliminar_proyecto);
router.post('/actualizarCobros/:id', ProyectoController.actualizar_cobros_proyecto);
router.get('/verPagos/:id', ProyectoController.ver_pagos_proyecto);


module.exports = api;
