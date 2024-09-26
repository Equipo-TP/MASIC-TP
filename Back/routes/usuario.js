'use strict'

var express = require('express');
var usuarioController = require('../controllers/UsuarioController');

var api = express.Router();

api.post('/login_user',usuarioController.login_user);
api.post('/registro_usuario', usuarioController.registro_usuario);
api.get('/listar_usuarios', usuarioController.listar_usuarios);
api.delete('/eliminar_usuario/:id', usuarioController.eliminar_usuario);
api.get('/actualizar_usuario/:id', usuarioController.obtener_usuario_por_id);
api.post('/obtener_usuario_por_id_y_password', usuarioController.obtener_usuario_por_id_y_password);
api.put('/actualizar_usuario/:id', usuarioController.actualizar_usuario);

module.exports = api;

/*
/api/listar_usuarios (GET): Lista todos los usuarios.
/api/eliminar_usuario/:id (DELETE): Elimina un usuario según su ID.
/api/obtener_usuario/:id (GET): Muestra la información de un usuario por su ID.
/api/obtener_usuario_por_id_y_password (POST): Muestra la información de un usuario por su ID y contraseña.
/api/actualizar_usuario/:id (PUT): Actualiza los datos de un usuario según su ID.
*/