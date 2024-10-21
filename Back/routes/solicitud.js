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

api.post('/obtener_solicitud_por_id/:id', solicitudController.obtener_solicitud_por_id);
api.get('/listar_solicitudes_aprobadas', solicitudController.listar_solicitudes_aprobadas);
api.get('/listar_solicitudes_aprobadas_para_presupuesto', solicitudController.listar_solicitudes_aprobadas_para_presupuesto);


module.exports = api;