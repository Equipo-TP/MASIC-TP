'use strict'

var express = require('express');
var instalacionController = require('../controllers/InstalacionController');

var api = express.Router();

api.post('/registro_tarifa', instalacionController.registro_precio_instalacion);
api.get('/listar_tarifas', instalacionController.listar_tarifario);
api.delete('/eliminar_tarifa/:id', instalacionController.eliminar_tarifa);
api.put('/editar_tarifa/:id', instalacionController.editar_tarifa);
api.post('/obtener_tarifa_por_id/:id', instalacionController.obtener_tarifario_por_id);

module.exports = api;