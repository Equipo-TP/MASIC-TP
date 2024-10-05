'use strict'

var express = require('express');
var clienteController = require('../controllers/ClienteController');

var api = express.Router();

api.post('/registro_cliente', clienteController.registro_cliente);
api.get('/listar_clientes', clienteController.listar_clientes);
api.put('/editar_cliente/:id', clienteController.editar_cliente);
api.post('/obtener_cliente/:id', clienteController.obtener_cliente);
api.post('/obtener_cliente_por_id/:id', clienteController.obtener_cliente_por_id);
module.exports = api;