const logger = require('../utils/logger');

/**
 * Middleware para tratar rotas não encontradas
 */
const notFoundHandler = (req, res, next) => {
  logger.warn(`Rota não encontrada: ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
};

module.exports = notFoundHandler;