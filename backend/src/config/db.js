const mongoose = require('mongoose');
const logger = require('../utils/logger');
const env = require('./env');

const connectDB = async () => {
  try {
    let mongoURI = env.MONGODB_URI;
    const dbName = env.DB_NAME;

    mongoURI = mongoURI.includes('/?') ? mongoURI.replace('/?', `/${dbName}?`) : `${mongoURI}/${dbName}`;
    
    await mongoose.connect(mongoURI);

    logger.info('Conexão MongoDB estabelecida com sucesso');
    return true;
  } catch (error) {
    logger.error(`Falha na conexão MongoDB: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;