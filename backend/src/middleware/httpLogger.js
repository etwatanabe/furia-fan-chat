const logger = require('../utils/logger');

/**
 * Middleware para logar requisições HTTP
 */
const httpLogger = (req, res, next) => {
  const start = new Date().getTime();

  res.on('finish', () => {
    const duration = new Date().getTime() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    
    // Log com nível apropriado baseado no status code
    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });

  next();
};

module.exports = httpLogger;