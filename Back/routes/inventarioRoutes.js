'use strict';

var express = require('express');
var inventarioController = require('../controllers/materialController');

var api = express.Router();

api.post('/registrar_movimiento', inventarioController.registrarMovimiento);
api.get('/listar_movimientos', inventarioController.listarMovimientos);
api.get('/obtener_movimiento/:id', inventarioController.obtenerMovimientoPorId);
api.delete('/eliminar_movimiento/:id', inventarioController.eliminarMovimiento);

module.exports = api;
