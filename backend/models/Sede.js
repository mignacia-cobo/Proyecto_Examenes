const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

// Definir el modelo Sede
const Sede = sequelize.define('Sede', {
    ID_Sede: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre_Sede: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Sede',
    timestamps: false
  });

  // Una sede puede tener muchas escuelas
  Sede.hasMany(Escuela, { foreignKey: 'ID_Sede' });
  
  // Sincronizar el modelo con la base de datos
  sequelize.sync()
    .then(() => {
      console.log('La tabla Sede ha sido sincronizada.');
    })
    .catch((error) => {
      console.error('Error al sincronizar la tabla Sede:', error);
    });


  
module.exports = Sede;