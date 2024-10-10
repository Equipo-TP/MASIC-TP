'use strict';

const express = require('express');
const ChatbotController = require('../chatbot/ChatbotController');

const api = express.Router();

// Ruta para manejar los mensajes del chatbot
api.post('/chatbot', ChatbotController.handleMessage);

module.exports = api;
