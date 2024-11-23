// models/Rol.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Rol = sequelize.define('Rol', {
  ID_Rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ID_Estado:{
    type: DataTypes.INTEGER,
    references: {
      model: 'Estado',
      key: 'ID_Estado'  
    }
}
}, {
  tableName: 'Rol',
  timestamps: false 
});


//un rol puede tener un estado
Rol.belongsTo(Estado, {foreignKey: 'ID_Estado', sourceKey: 'ID_Estado'});
//un estado puede tener muchos roles
Estado.hasMany(Rol, {foreignKey: 'ID_Estado', sourceKey: 'ID_Estado'});

module.exports = Rol;