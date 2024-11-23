// models/Usuario.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Usuario = sequelize.define('Usuario', {
    ID_User: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    Username: {
        type: DataTypes.STRING,
        unique: true
    },
    Password: {
        type: DataTypes.STRING
    },
    Nombre: {
        type: DataTypes.STRING
    },
    Rut: {
        type: DataTypes.STRING
    },
    Email: {
        type: DataTypes.STRING
    },
    ID_Escuela: {
        type: DataTypes.INTEGER,
    },
    ID_Rol: {
        type: DataTypes.INTEGER,
    },
    ID_Estado: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Estado',
            key: 'ID_Estado'
        }
    }
});
// Un estado puede estar asociado a varios usuarios
Estado.hasMany(Usuario, {foreignKey: 'ID_Estado'});
// Un usuario puede tener un estado
Usuario.belongsTo(Estado, {foreignKey: 'ID_Estado'});

// Una escuela puede estar asociada a varios usuarios
Escuela.hasMany(Usuario, {foreignKey: 'ID_Escuela'});
// Un usuario puede tener una escuela
Usuario.belongsTo(Escuela, {foreignKey: 'ID_Escuela'});

// Un rol puede estar asociado a varios usuarios
Rol.hasMany(Usuario, {foreignKey: 'ID_Rol'});
// Un usuario puede tener un rol
Usuario.belongsTo(Rol, {foreignKey: 'ID_Rol'});

module.exports = Usuario;