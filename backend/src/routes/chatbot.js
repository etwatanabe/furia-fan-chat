const express = require('express');
const router = express.Router();
const { getInitialMessage, sendMessage, updateData } = require('../controllers/chatbotController');

// Obter mensagem inicial
router.get('/initial', getInitialMessage);

// Enviar mensagem
router.post('/message', sendMessage);

module.exports = router;