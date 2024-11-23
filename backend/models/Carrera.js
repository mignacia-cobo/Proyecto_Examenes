const Carrera = sequelize.define('Carrera', {
    ID_Carrera: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ID_Escuela: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Escuela',
            key: 'ID_Escuela'
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

// Una carrera pertenece a una escuela
Carrera.belongsTo(Escuela, { foreignKey: 'ID_Escuela' });

// Una carrera tiene un estado
Carrera.belongsTo(Estado, { foreignKey: 'ID_Estado' });


module.exports = Carrera;