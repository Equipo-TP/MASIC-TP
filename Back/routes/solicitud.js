'use strict'

var express = require('express');
var solicitudController = require('../controllers/SolicitudController');

var api = express.Router();
var auth = require('../middlewares/authenticate').auth;

api.post('/registro_solicitud', solicitudController.registro_solicitud);
api.get('/listar_solicitudes_vendedora', auth, solicitudController.listar_solicitudes_vendedora);
api.get('/listar_solicitudes_administrador', solicitudController.listar_solicitudes_administrador);
api.put('/editar_solicitud/:id', solicitudController.editar_solicitud);
api.post('/obtenerSolicitudesPorCliente/:id', solicitudController.obtenerSolicitudesPorCliente);

module.exports = api;