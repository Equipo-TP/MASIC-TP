'use strict';

var express = require('express');
var tarifaController = require('../controllers/TarifaController');

var api = express.Router();
var auth = require('../middlewares/authenticate').auth;

api.post('/registro_tarifa', tarifaController.registro_tarifa);
api.get('/listar_tarifas', tarifaController.listar_tarifas);
api.get('/obtener_tarifa_por_id/:id', tarifaController.obtener_tarifa_por_id);
api.put('/editar_tarifa/:id', tarifaController.editar_tarifa);
api.delete('/eliminar_tarifa/:id', tarifaController.eliminar_tarifa); // Añadido

module.exports = api;
