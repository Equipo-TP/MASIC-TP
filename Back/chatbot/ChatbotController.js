'use strict';

const ChatbotController = {};

ChatbotController.handleMessage = (req, res) => {
    const userMessage = req.body.message || '';

    let response;

    if (userMessage.toLowerCase().includes('hola')) {
        response = '¡Hola! ¿En qué puedo ayudarte hoy?';
    } else {
        response = 'Lo siento, no entendí tu mensaje.';
    }

    res.json({ reply: response });
};

module.exports = ChatbotController;
