'use strict';

var express = require('express');
var PresupuestoTarifaController = require('../controllers/PresupuestoTarifaController');

var api = express.Router();

api.post('/registrar_presupuesto_tarifa', PresupuestoTarifaController.registrar_presupuesto_tarifa);
api.get('/listar_presupuestos_tarifa_por_instalacion/:id', PresupuestoTarifaController.listar_presupuestos_tarifa_por_instalacion);
api.put('/editar_presupuesto_tarifa/:id', PresupuestoTarifaController.editar_presupuesto_tarifa); // Editar
api.delete('/eliminar_presupuesto_tarifa/:id', PresupuestoTarifaController.eliminar_presupuesto_tarifa); // Eliminar nuevo

module.exports = api;

