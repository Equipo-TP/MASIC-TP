'use strict'

var express = require('express');
var solicitudController = require('../controllers/SolicitudController');

var api = express.Router();

api.post('/registro_solicitud', solicitudController.registro_solicitud);
api.get('/listar_solicitudes_vendedora', solicitudController.listar_solicitudes_vendedora);
api.get('/listar_solicitudes_administrador', solicitudController.listar_solicitudes_administrador);
api.put('/editar_solicitud/:id', solicitudController.editar_solicitud);
api.post('/obtener_solicitud_por_id/:id', solicitudController.obtener_solicitud_por_id);

module.exports = api;