const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatbotRoutes = require('./routes/chatbot');
const errorHandler = require('./middleware/errorHandler');
const httpLogger = require('./middleware/httpLogger');
const notFoundHandler = require('./middleware/notFoundHandler');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const app = express();

// Conectar ao MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(httpLogger);

// Rota de teste para verificar se a API está funcionando
app.get('/', (req, res) => {
  logger.info('API root endpoint accessed');
  res.json({ message: 'Bem-vindo(a) à API do FURIA Fans Chat!' });
});

// Rotas do chatbot
app.use('/api/chatbot', chatbotRoutes);

// Middleware para tratar rotas não encontradas
app.use(notFoundHandler);

// Middleware para tratar erros
app.use(errorHandler);

module.exports = app;