'use strict';

const express = require('express');
const ChatbotController = require('../controllers/chatbotController');

const router = express.Router();

router.post('/chatbot', ChatbotController.handleMessage);

module.exports = router;
