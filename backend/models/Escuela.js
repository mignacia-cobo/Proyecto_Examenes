const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Escuela = sequelize.define('Escuela', {
    ID_Escuela: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING,
    },
    ID_Sede: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Sede',
            key: 'ID_Sede'
        }
    },
    ID_Estado: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Estado',
            key: 'ID_Estado'
        }
    }
});

// Una sede puede tener muchas escuelas
Sede.hasMany(Escuela, { foreignKey: 'ID_Sede' });
// Una escuela pertenece a una sede
Escuela.belongsTo(Sede, { foreignKey: 'ID_Sede' });

// Una escuela puede tener muchas carreras
Escuela.hasMany(Carrera, { foreignKey: 'ID_Escuela' });
// Una carrera pertenece a una escuela
Carrera.belongsTo(Escuela, { foreignKey: 'ID_Escuela' });

// Una escuela puede tener un estado
Escuela.belongsTo(Estado, { foreignKey: 'ID_Estado' });
// Un estado puede tener muchas escuelas
Estado.hasMany(Escuela, { foreignKey: 'ID_Estado' });

module.exports = Escuela;