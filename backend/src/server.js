const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

const server = http.createServer(app);
const PORT = env.PORT || 3000;

// Tratamento para erros do servidor HTTP
server.on('error', (error) => {
  logger.error(`Erro no servidor HTTP: ${error.message}`);
  if (error.code === 'EADDRINUSE') {
      logger.error(`Porta ${PORT} já está em uso`);
  }
});

// Iniciar o servidor
server.listen(PORT, () => {
    logger.info(`Servidor rodando em http://localhost:${PORT} em modo ${env.NODE_ENV || 'development'}`);
});

// Tratamento para encerramento gracioso
process.on('SIGTERM', () => {
  logger.info('Sinal SIGTERM recebido. Encerrando servidor...');
  server.close(async () => {
      logger.info('Servidor HTTP encerrado com sucesso');
      await mongoose.connection.close();
      logger.info('Conexão MongoDB encerrada com sucesso');
      process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('Sinal SIGINT recebido. Encerrando servidor...');
  server.close(async () => {
      logger.info('Servidor HTTP encerrado com sucesso');
      await mongoose.connection.close();
      logger.info('Conexão MongoDB encerrada com sucesso');
      process.exit(0);
  });
});

process.on('uncaughtException', async (error) => {
  logger.error(`Exceção não tratada: ${error.message}`);
  logger.error(error.stack);
  await mongoose.connection.close();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  logger.error('Rejeição de promessa não tratada');
  logger.error(`Razão: ${reason}`);
  await mongoose.connection.close();
  process.exit(1);
});