const logger = require('../utils/logger');

/**
 * Middleware para tratamento de erros
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log detalhes do erro
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Se for erro de servidor, log do stack trace
  if (statusCode >= 500) {
    logger.error(`Stack: ${err.stack}`);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: message,
  });
};

module.exports = errorHandler;
