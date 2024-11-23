const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');
const Sede = require('./Sede');

const Edificio = sequelize.define('Edificio', {
  ID_Edificio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre_Edificio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ID_Sede: {
    type: DataTypes.INTEGER,
    references: {
      model: Sede,
      key: 'ID_Sede'
    }
  }
}, {
  tableName: 'Edificio',
  timestamps: false
});

// Definir las relaciones
Sede.hasMany(Edificio, { foreignKey: 'ID_Sede' });
Edificio.belongsTo(Sede, { foreignKey: 'ID_Sede' });

// Sincronizar el modelo con la base de datos

sequelize.sync()
.then(() => {
  console.log('La tabla Edificio ha sido sincronizada.');
})
.catch((error) => {
  console.error('Error al sincronizar la tabla Edificio:', error);
});

module.exports = Edificio;