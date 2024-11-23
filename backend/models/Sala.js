const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');
const Edificio = require('./Edificio');

const Sala = sequelize.define('Sala', {
  ID_Sala: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  ID_Edificio: {
    type: DataTypes.INTEGER,
    references: {
      model: Edificio,
      key: 'ID_Edificio'
    }
  },
  ID_Estado:{
    type: DataTypes.INTEGER,
    references: {
      model: 'Estado',
      key: 'ID_Estado'
    }
  }
}, {
  tableName: 'Sala',
  timestamps: true // Si no tienes columnas de timestamps en tu tabla
});

// Definir las relaciones
Edificio.hasMany(Sala, { foreignKey: 'ID_Edificio' });
Sala.belongsTo(Edificio, { foreignKey: 'ID_Edificio' });

// Sincronizar el modelo con la base de datos

  sequelize.sync()
  .then(() => {
    console.log('La tabla Sala ha sido sincronizada.');
  })
  .catch((error) => {
    console.error('Error al sincronizar la tabla Sala:', error);
  });
  
  
module.exports = Sala;