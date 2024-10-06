'use strict';

var express = require('express');
var presupuestoController = require('../controllers/PresupuestoController');

var api = express.Router();
var auth = require('../middlewares/authenticate').auth;

// Rutas para manejar presupuestos
api.post('/registro_presupuesto', auth, presupuestoController.registro_presupuesto);
api.get('/obtener_presupuesto_por_id_solicitud/:id', auth, presupuestoController.obtener_presupuesto_por_id_solicitud);
api.put('/editar_presupuesto/:id', auth, presupuestoController.editar_presupuesto);

module.exports = api;
