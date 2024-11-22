const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

const Modulo = sequelize.define('Modulo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_final: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Modulo',
  timestamps: false // Si no tienes columnas de timestamps en tu tabla
});

// Sincronizar el modelo con la base de datos
sequelize.sync()
  .then(() => {
    console.log('La tabla Modulo ha sido sincronizada.');
  })
  .catch((error) => {
    console.error('Error al sincronizar la tabla Modulo:', error);
  });

module.exports = Modulo;