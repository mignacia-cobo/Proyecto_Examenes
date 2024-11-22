const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');


const Sala = sequelize.define('Sala', {
  ID_Sala: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Codigo_sala: {
    type: DataTypes.STRING
  },
  Nombre_sala: {
    type: DataTypes.STRING
  },
  Capacidad: {
    type: DataTypes.INTEGER
  },
  Edificio_ID: {
    type: DataTypes.STRING
  },
  Estado: {
    type: DataTypes.BOOLEAN
  }
}, {
  tableName: 'Sala',
  timestamps: true // Si no tienes columnas de timestamps en tu tabla
});

// Sincronizar el modelo con la base de datos

  sequelize.sync()
  .then(() => {
    console.log('La tabla Sala ha sido sincronizada.');
  })
  .catch((error) => {
    console.error('Error al sincronizar la tabla Sala:', error);
  });
  
  
module.exports = Sala;