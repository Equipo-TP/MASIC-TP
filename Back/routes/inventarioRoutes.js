const express = require('express');
const api = express.Router();
const inventarioController = require('../controllers/inventarioController');

api.post('/movimiento', inventarioController.createMovimiento);

module.exports = api;