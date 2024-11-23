// models/Estado.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Estado = sequelize.define('Estado', {
  ID_Estado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Estado;