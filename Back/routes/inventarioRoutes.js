'use strict';

var express = require('express');
var inventarioController = require('../controllers/inventarioController');

var api = express.Router();

api.post('/registrar_movimiento', inventarioController.registrarMovimiento);
api.get('/listar_movimientos', inventarioController.listarMovimientos);
api.get('/obtener_movimiento/:id', inventarioController.obtenerMovimientoPorId);
api.put('/editar_movimiento/:id', inventarioController.editarMovimiento);
api.delete('/eliminar_movimiento/:id', inventarioController.eliminarMovimiento);

module.exports = api;
