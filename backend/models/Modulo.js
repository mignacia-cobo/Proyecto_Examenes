const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

const Modulo = sequelize.define('Modulo', {
  ID_Modulo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  Hora_final: {
    type: DataTypes.TIME,
    allowNull: false
  },
  ID_Estado: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Estado',
      key: 'ID_Estado'  
    }
  }
}, {
  tableName: 'Modulo',
  timestamps: false // Si no tienes columnas de timestamps en tu tabla
});

// Un módulo tiene un estado
Modulo.belongsTo(Estado, { foreignKey: 'ID_Estado' });
// Un estado puede tener muchos módulos
Estado.hasMany(Modulo, { foreignKey: 'ID_Estado' });


// Sincronizar el modelo con la base de datos
sequelize.sync()
  .then(() => {
    console.log('La tabla Modulo ha sido sincronizada.');
  })
  .catch((error) => {
    console.error('Error al sincronizar la tabla Modulo:', error);
  });

module.exports = Modulo;