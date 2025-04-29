const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Carregar variáveis do arquivo .env
dotenv.config();

// Configuração de ambiente com valores padrão e validações
const env = {
  // Servidor
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/furia_fan_chat',
  DB_NAME: process.env.DB_NAME || 'furia_fans_chat',
  
  // Logs
  LOG_LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'http' : 'debug'),
  
  // Validar ambientes específicos
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};

// Logar informações sobre o ambiente (apenas no modo de desenvolvimento)
if (env.isDev) {
  logger.debug('Variáveis de ambiente carregadas:');
  logger.debug(`NODE_ENV: ${env.NODE_ENV}`);
  logger.debug(`PORT: ${env.PORT}`);
  logger.debug(`MongoDB URI: ${env.MONGODB_URI.substring(0, 10)}...`); // Não mostrar a URI completa por segurança
}

module.exports = env;