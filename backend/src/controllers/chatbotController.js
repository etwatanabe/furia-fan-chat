const botService = require('../services/botService');
const logger = require('../utils/logger');

exports.getInitialMessage = async (req, res) => {
    try {
        logger.info('Solicitada mensagem inicial');
        
        const initialMessage = await botService.getInitialMessage();
        
        res.status(200).json({
            success: true,
            initialMessage
        });
    } catch (error) {
        logger.error(`Erro ao obter mensagem inicial: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Erro ao iniciar conversa',
            error: error.message
        });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { currentState, message } = req.body;

        logger.debug(`Processando mensagem no estado ${currentState}: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
        
        if (!message || message.trim() === '') {
            logger.warn('Tentativa de envio de mensagem vazia');
            return res.status(400).json({
                success: false,
                message: 'A mensagem não pode estar vazia'
            });
        }
        
        const response = await botService.processMessage(currentState, message);
        
        logger.info(`Mensagem processada com sucesso`);
        res.status(200).json({
            success: true,
            userMessage: response.userMessage,
            botResponse: response.botResponse,
            nextState: response.nextState
        });
    } catch (error) {
        logger.error(`Erro ao processar mensagem: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar mensagem',
            error: error.message
        });
    }
};