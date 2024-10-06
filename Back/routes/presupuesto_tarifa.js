'use strict';

var express = require('express');
var PresupuestoTarifaController = require('../controllers/PresupuestoTarifaController');

var api = express.Router();

api.post('/registrar_presupuesto_tarifa', PresupuestoTarifaController.registrar_presupuesto_tarifa);
api.get('/listar_presupuestos_tarifa_por_presupuesto/:id', PresupuestoTarifaController.listar_presupuestos_tarifa_por_presupuesto);
api.get('/listar_presupuestos_tarifa_por_tarifa/:id', PresupuestoTarifaController.listar_presupuestos_tarifa_por_tarifa);
api.put('/editar_presupuesto_tarifa/:id', PresupuestoTarifaController.editar_presupuesto_tarifa); // Nueva ruta para editar

module.exports = api;
