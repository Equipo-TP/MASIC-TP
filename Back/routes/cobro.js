'use strict';

var express = require('express');
var cobroController = require('../controllers/CobroController');

var api = express.Router();

api.post('/registro_cobro', cobroController.registro_cobro);
api.get('/listar_cobros', cobroController.listar_cobros);
api.get('/obtener_cobro/:id', cobroController.obtener_cobro_por_id);
api.put('/editar_cobro/:id', cobroController.editar_cobro);
api.delete('/eliminar_cobro/:id', cobroController.eliminar_cobro);

api.get('/obtener_cobro_con_pagos/:id', cobroController.obtener_cobro_con_pagos);
api.get('/ver_detalles/:id', cobroController.obtener_cobro_detallado);


module.exports = api;
