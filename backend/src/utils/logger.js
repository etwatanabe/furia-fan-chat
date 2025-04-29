const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Criar diretório de logs se não existir
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Definir níveis de log e cores
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Definir cores para cada tipo de log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Adicionar cores ao winston
winston.addColors(colors);

// Definir formato baseado no ambiente
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Definir transporters (onde os logs serão gravados)
const transports = [
  // Console para todos os logs
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
      ),
    ),
  }),
  
  // Arquivo para erros
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
  }),
  
  // Arquivo para todos os logs
  new winston.transports.File({ 
    filename: path.join(logDir, 'combined.log'),
  }),
];

// Criar logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'http' : 'debug',
  levels,
  format,
  transports,
});

module.exports = logger;