//const { DataTypes } = require('sequelize');

//const { sequelize } = require('../../backend/database.sqlite');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  //storage: 'path/to/database.sqlite' // Asegúrate de que esta ruta sea correcta
  storage: '../../backend/database.sqlite'
});

const Sala = sequelize.define('Sala', {
  ID_Sala: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  Nombre: {
    type: DataTypes.STRING
  },
  Capacidad: {
    type: DataTypes.INTEGER
  },
  Edificio_ID: {
    type: DataTypes.INTEGER
  }
},{
  tableName: 'Salas'
});

module.exports = Sala;