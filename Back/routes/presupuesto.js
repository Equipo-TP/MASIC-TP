'use strict'


var express = require('express');
var presupuestoController = require('../controllers/PresupuestoController');

var api = express.Router();
var auth = require('../middlewares/authenticate').auth;

api.post('/registro_presupuesto', presupuestoController.registro_presupuesto);
api.get('/obtener_presupuesto_por_id_solicitud/:id', auth, presupuestoController.obtener_presupuesto_por_solicitud);
api.get('/ver_presupuesto_id/:id', auth, presupuestoController.ver_presupuesto_id);
api.put('/editar_presupuesto/:id', auth, presupuestoController.editar_presupuesto);
api.delete('/eliminar_presupuesto/:id', auth, presupuestoController.eliminar_presupuesto);
api.get('/listar_presupuestos_vendedora', auth, presupuestoController.listar_presupuestos_vendedora);
api.get('/listar_presupuestos', auth, presupuestoController.listar_presupuestos);
api.get('/listar_presupuestos_administrador', presupuestoController.listar_presupuestos);
//api.get('/presupuestos_aceptados', presupuestoController.presupuestos_aceptados);

module.exports = api;
