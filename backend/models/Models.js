const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

// Modelos

const Sede = sequelize.define('Sede', {
  ID_Sede: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre_Sede: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'Sede', freezeTableName: true, timestamps: false });

const Edificio = sequelize.define('Edificio', {
  ID_Edificio: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre_Edificio: { type: DataTypes.STRING, allowNull: false },
  ID_Sede: {
    type: DataTypes.INTEGER,
    references: { model: Sede, key: 'ID_Sede' }
  }
}, { tableName: 'Edificio', freezeTableName: true, timestamps: false });

const Escuela = sequelize.define('Escuela', {
  ID_Escuela: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING },
  ID_Sede: {
    type: DataTypes.INTEGER,
    references: { model: Sede, key: 'ID_Sede' }
  },
  ID_Estado: {
    type: DataTypes.INTEGER,
    references: { model: 'Estado', key: 'ID_Estado' }
  }
}, { tableName: 'Escuela', freezeTableName: true, timestamps: true });

const Usuario = sequelize.define('Usuario', {
  ID_Usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Username: { type: DataTypes.STRING, unique: true },
  Password: { type: DataTypes.STRING },
  Nombre: { type: DataTypes.STRING },
  Rut: { type: DataTypes.STRING },
  Email: { type: DataTypes.STRING },
  ID_Rol: {
    type: DataTypes.INTEGER,
    references: { model: 'Rol', key: 'ID_Rol' }
  },
  ID_Estado: {
    type: DataTypes.INTEGER,
    references: { model: 'Estado', key: 'ID_Estado' }
  }
}, { tableName: 'Usuario', freezeTableName: true, timestamps: true });

const Carrera = sequelize.define('Carrera', {
  ID_Carrera: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING, allowNull: false },
  ID_Escuela: {
    type: DataTypes.INTEGER,
    references: { model: Escuela, key: 'ID_Escuela' }
  },
  ID_Coordinador: {
    type: DataTypes.INTEGER,
    references: { model: Usuario, key: 'ID_Usuario' }
  },
  ID_Estado: {
    type: DataTypes.INTEGER,
    references: { model: 'Estado', key: 'ID_Estado' }
  }
}, { tableName: 'Carrera', freezeTableName: true, timestamps: true });

const Asignatura = sequelize.define('Asignatura', {
  ID_Asignatura: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre_Asignatura: { type: DataTypes.STRING, allowNull: false },
  ID_Carrera: {
    type: DataTypes.INTEGER,
    references: { model: Carrera, key: 'ID_Carrera' }
  }
}, { tableName: 'Asignatura', freezeTableName: true, timestamps: false });

const Examen = sequelize.define('Examen', {
  ID_Examen: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre_Examen: { type: DataTypes.STRING, allowNull: false },
  ID_Asignatura: {
    type: DataTypes.INTEGER,
    references: { model: Asignatura, key: 'ID_Asignatura' }
  },
  ID_Estado: {
    type: DataTypes.INTEGER,
    references: { model: 'Estado', key: 'ID_Estado' }
  }
}, { tableName: 'Examen', freezeTableName: true, timestamps: false });

const Sala = sequelize.define('Sala', {
  ID_Sala: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Codigo_sala: { type: DataTypes.STRING },
  Nombre_sala: { type: DataTypes.STRING },
  Capacidad: { type: DataTypes.INTEGER },
  ID_Edificio: {
    type: DataTypes.INTEGER,
    references: { model: Edificio, key: 'ID_Edificio' }
  },
  ID_Estado: {
    type: DataTypes.INTEGER,
    references: { model: 'Estado', key: 'ID_Estado' }
  }
}, { tableName: 'Sala', freezeTableName: true, timestamps: true });

const Modulo = sequelize.define('Modulo', {
  ID_Modulo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Numero: { type: DataTypes.INTEGER, allowNull: false },
  Hora_inicio: { type: DataTypes.TIME, allowNull: false },
  Hora_final: { type: DataTypes.TIME, allowNull: false },
  ID_Estado: {
    type: DataTypes.INTEGER,
    references: { model: 'Estado', key: 'ID_Estado' }
  }
}, { tableName: 'Modulo', freezeTableName: true, timestamps: false });

const Reserva = sequelize.define('Reserva', {
  ID_Reserva: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Fecha: { type: DataTypes.DATEONLY, allowNull: false },
  ID_Sala: {
    type: DataTypes.INTEGER,
    references: { model: Sala, key: 'ID_Sala' }
  },
  ID_Modulo: {
    type: DataTypes.INTEGER,
    references: { model: Modulo, key: 'ID_Modulo' }
  },
  ID_Examen: {
    type: DataTypes.INTEGER,
    references: { model: Examen, key: 'ID_Examen' }
  }
}, { tableName: 'Reserva', freezeTableName: true, timestamps: false });

const Rol = sequelize.define('Rol', {
  ID_Rol: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'Rol', freezeTableName: true, timestamps: false });

const Estado = sequelize.define('Estado', {
  ID_Estado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'Estado', freezeTableName: true, timestamps: false });

// Relaciones principales

// Sede
Sede.hasMany(Escuela, { foreignKey: 'ID_Sede' });
Sede.hasMany(Edificio, { foreignKey: 'ID_Sede' });

// Escuela
Escuela.hasMany(Carrera, { foreignKey: 'ID_Escuela' });
Escuela.belongsTo(Sede, { foreignKey: 'ID_Sede' });

// Carrera
Carrera.belongsTo(Escuela, { foreignKey: 'ID_Escuela' });
Carrera.hasMany(Asignatura, { foreignKey: 'ID_Carrera' });
Carrera.belongsTo(Usuario, { foreignKey: 'ID_Coordinador' });

// Reserva
Reserva.belongsTo(Sala, { foreignKey: 'ID_Sala' });
Reserva.belongsTo(Modulo, { foreignKey: 'ID_Modulo' });
Reserva.belongsTo(Examen, { foreignKey: 'ID_Examen' });

// Asignatura y Examen
Asignatura.hasMany(Examen, { foreignKey: 'ID_Asignatura' });

// Estado y Modulo
Estado.hasMany(Modulo, { foreignKey: 'ID_Estado' });
Modulo.belongsTo(Estado, { foreignKey: 'ID_Estado' });

// Sala y Edificio
Edificio.hasMany(Sala, { foreignKey: 'ID_Edificio' });
Sala.belongsTo(Edificio, { foreignKey: 'ID_Edificio' });

// Sala y Estado
Estado.hasMany(Sala, { foreignKey: 'ID_Estado' });
Sala.belongsTo(Estado, { foreignKey: 'ID_Estado' });

module.exports = {
  Sede, Edificio, Escuela, Usuario, Carrera, Asignatura, Examen, Sala, Modulo, Reserva, Rol, Estado
};