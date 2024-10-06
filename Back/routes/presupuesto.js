'use strict'

var express = require('express');
var presupuestoController = require('../controllers/PresupuestoController');

var api = express.Router();
var auth = require('../middlewares/authenticate').auth;

api.post('/registro_presupuesto', presupuestoController.registro_presupuesto);
api.get('/listar_presupuestos_vendedora', auth, presupuestoController.listar_presupuestos_vendedora);
api.get('/listar_presupuestos_administrador', presupuestoController.listar_presupuestos_administrador);
api.put('/editar_presupuesto/:id', presupuestoController.editar_presupuesto);
api.post('/obtener_presupuesto_por_id/:id', presupuestoController.obtener_presupuesto_por_id);
api.get('/presupuestos_aceptados', presupuestoController.presupuestos_aceptados);

module.exports = api;