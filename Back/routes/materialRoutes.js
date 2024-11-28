'use strict'

var express = require('express');
var materialController = require('../controllers/materialController');

var api = express.Router();

api.post('/registro_material', materialController.registrarMaterial);
api.get('/listar_materiales', materialController.listarMateriales);
api.get('/obtener_material_por_id/:id', materialController.obtenerMaterialPorId);
api.put('/editar_material/:id', materialController.editarMaterial);
api.delete('/eliminar_material/:id', materialController.eliminarMaterial);

module.exports = api;