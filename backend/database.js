const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const conectarDB = async () => {
    try {
      await sequelize.authenticate();
      console.log('Base de datos conectada');
    } catch (error) {
      console.error('Error conectando a la base de datos:', error);
      process.exit(1);
    }
  };
  
  module.exports = { conectarDB, sequelize };