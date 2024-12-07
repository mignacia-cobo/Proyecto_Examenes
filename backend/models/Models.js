//const { DataTypes } = require('sequelize');
//const { sequelize } = require('../database');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log
});

// Modelos

const Sede = sequelize.define('Sede', {
  ID_Sede: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre_Sede: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'Sede', freezeTableName: true, timestamps: false });

const Edificio = sequelize.define('Edificio', {
  ID_Edificio: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre_Edificio: { type: DataTypes.STRING, allowNull: false },
  ID_Sede: {type: DataTypes.INTEGER,references: { model: Sede, key: 'ID_Sede' }}
}, { tableName: 'Edificio', freezeTableName: true, timestamps: false });

const Escuela = sequelize.define('Escuela', {
  ID_Escuela: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING },
  ID_Sede: {type: DataTypes.INTEGER,references: { model: Sede, key: 'ID_Sede' }},
  ID_Estado: {type: DataTypes.INTEGER,references: { model: 'Estado', key: 'ID_Estado' }}
}, { tableName: 'Escuela', freezeTableName: true, timestamps: true });

const Jornada = sequelize.define('Jornada', {
  ID_Jornada: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING }
}, { tableName: 'Jornada', freezeTableName: true, timestamps: false });

const Usuario = sequelize.define('Usuario', {
  ID_Usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Username: { type: DataTypes.STRING}, //unique: true 
  Password: { type: DataTypes.STRING },
  Nombre: { type: DataTypes.STRING, allowNull: false  },
  Rut: { type: DataTypes.STRING },
  Email: { type: DataTypes.STRING },
  ID_Rol: {type: DataTypes.INTEGER,references: { model: 'Rol', key: 'ID_Rol' }},
  ID_Estado: {type: DataTypes.INTEGER,references: { model: 'Estado', key: 'ID_Estado' }}
}, { tableName: 'Usuario', freezeTableName: true, timestamps: true });

const Carrera = sequelize.define('Carrera', {
  ID_Carrera: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING, allowNull: false },
  ID_Escuela: {type: DataTypes.INTEGER,references: { model: Escuela, key: 'ID_Escuela' }},
  ID_Jornada: {type: DataTypes.INTEGER,references: { model: Jornada, key: 'ID_Jornada' }},
  ID_Estado: {type: DataTypes.INTEGER,references: { model: 'Estado', key: 'ID_Estado' }}
}, { tableName: 'Carrera', freezeTableName: true, timestamps: true });

const Asignatura = sequelize.define('Asignatura', {
  ID_Asignatura: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre_Asignatura: { type: DataTypes.STRING, allowNull: false },
  Nivel: { type: DataTypes.INTEGER, allowNull: false },
  ID_Carrera: {type: DataTypes.INTEGER,references: { model: Carrera, key: 'ID_Carrera' }}
}, { tableName: 'Asignatura', freezeTableName: true, timestamps: false });

const Seccion = sequelize.define('Seccion',{
  ID_Seccion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre_Seccion: { type: DataTypes.STRING, allowNull: false },
  ID_Asignatura: {type: DataTypes.INTEGER,references: { model: Asignatura, key: 'ID_Asignatura' }},
  ID_Jornada: {type: DataTypes.INTEGER,references: { model: Jornada, key: 'ID_Jornada' }},
},{ tableName: 'Seccion', freezeTableName: true, timestamps: false });

const Examen = sequelize.define('Examen', {
  ID_Examen: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre_Examen: { type: DataTypes.STRING, allowNull: false },
  ID_Asignatura: {type: DataTypes.INTEGER,references: { model: Asignatura, key: 'ID_Asignatura' }},
  ID_Seccion: {type: DataTypes.INTEGER,references: { model: Seccion, key: 'ID_Seccion' }},
  Inscritos: { type: DataTypes.INTEGER },
  Tipo_Procesamiento: { type: DataTypes.STRING },
  Plataforma_Procesamiento: { type: DataTypes.STRING },
  Situacion_Evaluativa: { type: DataTypes.STRING },
  Cantidad_Modulos: { type: DataTypes.INTEGER },
  ID_Estado: {type: DataTypes.INTEGER,references: { model: 'Estado', key: 'ID_Estado' }}
}, { tableName: 'Examen', freezeTableName: true, timestamps: false });

const Sala = sequelize.define('Sala', {
  ID_Sala: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Codigo_sala: { type: DataTypes.STRING },
  Nombre_sala: { type: DataTypes.STRING },
  Capacidad: { type: DataTypes.INTEGER },
  ID_Edificio: {type: DataTypes.INTEGER,references: { model: Edificio, key: 'ID_Edificio' }},
  ID_Estado: {type: DataTypes.INTEGER,references: { model: 'Estado', key: 'ID_Estado' }}
}, { tableName: 'Sala', freezeTableName: true, timestamps: true });

const Modulo = sequelize.define('Modulo', {
  ID_Modulo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Numero: { type: DataTypes.INTEGER, allowNull: false },
  Hora_inicio: { type: DataTypes.TIME, allowNull: false },
  Hora_final: { type: DataTypes.TIME, allowNull: false },
  ID_Estado: {type: DataTypes.INTEGER,references: { model: 'Estado', key: 'ID_Estado' }}
}, { tableName: 'Modulo', freezeTableName: true, timestamps: false });

const Reserva = sequelize.define('Reserva', {
  ID_Reserva: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Fecha: { type: DataTypes.DATEONLY, allowNull: false },
  ID_Sala: {type: DataTypes.INTEGER,references: { model: Sala, key: 'ID_Sala' }},
  ID_Examen: {type: DataTypes.INTEGER,references: { model: Examen, key: 'ID_Examen' }}
}, { tableName: 'Reserva', freezeTableName: true, timestamps: false });

const Rol = sequelize.define('Rol', {
  ID_Rol: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'Rol', freezeTableName: true, timestamps: false });

const Estado = sequelize.define('Estado', {
  ID_Estado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'Estado', freezeTableName: true, timestamps: false });

const ReservaModulo = sequelize.define('ReservaModulo', {
  ID_Reserva: {type: DataTypes.INTEGER,references: {model: 'Reserva',key: 'ID_Reserva',},},
  ID_Modulo: {type: DataTypes.INTEGER,references: {model: 'Modulo',key: 'ID_Modulo',},},
}, { tableName: 'ReservaModulo', freezeTableName: true, timestamps: false });

const CarreraJornada = sequelize.define('CarreraJornada', {
  ID_Carrera: {type: DataTypes.INTEGER,references: {model: 'Carrera',key: 'ID_Carrera',},},
  ID_Jornada: {type: DataTypes.INTEGER,references: {model: 'Jornada',key: 'ID_Jornada',},},
}, { tableName: 'CarreraJornada', freezeTableName: true, timestamps: false });

const UsuarioCarrera = sequelize.define('UsuarioCarrera', {
  ID_Usuario: {type: DataTypes.INTEGER,references: { model: 'Usuario', key: 'ID_Usuario' },},
  ID_Carrera: {type: DataTypes.INTEGER,references: { model: 'Carrera', key: 'ID_Carrera' },},
}, {tableName: 'UsuarioCarrera',freezeTableName: true,timestamps: false,});

const UsuarioSeccion = sequelize.define('UsuarioSeccion', {
  ID_Usuario: {type: DataTypes.INTEGER,references: { model: 'Usuario', key: 'ID_Usuario' },},
  ID_Seccion: {type: DataTypes.INTEGER,references: { model: 'Seccion', key: 'ID_Seccion' },},
}, {tableName: 'UsuarioSeccion',freezeTableName: true,timestamps: false,}); 

// Relaciones principales
//reservaModulo
Reserva.belongsToMany(Modulo, { through: ReservaModulo, foreignKey: 'ID_Reserva' });
Modulo.belongsToMany(Reserva, { through: ReservaModulo, foreignKey: 'ID_Modulo' });

//CarreraJornada
Carrera.belongsToMany(Jornada, { through: CarreraJornada, foreignKey: 'ID_Carrera' });
Jornada.belongsToMany(Carrera, { through: CarreraJornada, foreignKey: 'ID_Jornada' });

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

// Asignatura y Examen
Asignatura.hasMany(Examen, { foreignKey: 'ID_Asignatura' });
Examen.belongsTo(Asignatura, { foreignKey: 'ID_Asignatura' }); // Relación "pertenece a"


// Estado y Modulo
Estado.hasMany(Modulo, { foreignKey: 'ID_Estado' });
Modulo.belongsTo(Estado, { foreignKey: 'ID_Estado' });

// Sala y Edificio
Edificio.hasMany(Sala, { foreignKey: 'ID_Edificio' });
Sala.belongsTo(Edificio, { foreignKey: 'ID_Edificio' });

// Sala y Estado
Estado.hasMany(Sala, { foreignKey: 'ID_Estado' });
Sala.belongsTo(Estado, { foreignKey: 'ID_Estado' });

//Relaciones de reserva
Reserva.belongsToMany(Modulo, {through: 'ReservaModulo', foreignKey: 'ID_Reserva',otherKey: 'ID_Modulo',});
Reserva.belongsTo(Sala, {foreignKey: 'ID_Sala',});
Reserva.belongsTo(Examen, {foreignKey: 'ID_Examen',});

//Relacion de modulo
Modulo.belongsToMany(Reserva, {through: 'ReservaModulo', foreignKey: 'ID_Modulo',otherKey: 'ID_Reserva',});

//Escuela - Estado:
Escuela.belongsTo(Estado, { foreignKey: 'ID_Estado' });
Estado.hasMany(Escuela, { foreignKey: 'ID_Estado' });

//Examen - Estado:
Examen.belongsTo(Estado, { foreignKey: 'ID_Estado' });
Estado.hasMany(Examen, { foreignKey: 'ID_Estado' });

//Usuario - Rol:
Usuario.belongsTo(Rol, { foreignKey: 'ID_Rol' });
Rol.hasMany(Usuario, { foreignKey: 'ID_Rol' });

//Usuario - Estado:
Usuario.belongsTo(Estado, { foreignKey: 'ID_Estado' });
Estado.hasMany(Usuario, { foreignKey: 'ID_Estado' });

// Relación Usuario - Carrera (Muchos a Muchos)
Usuario.belongsToMany(Carrera, { through: UsuarioCarrera, foreignKey: 'ID_Usuario' });
Carrera.belongsToMany(Usuario, { through: UsuarioCarrera, foreignKey: 'ID_Carrera' });
//Relacion de SECCION
//Seccion - Asignatura:
Seccion.belongsTo(Asignatura, { foreignKey: 'ID_Asignatura' });
Asignatura.hasMany(Seccion, { foreignKey: 'ID_Asignatura' });
//Seccion - Examen:
Seccion.hasMany(Examen, { foreignKey: 'ID_Seccion' });
Examen.belongsTo(Seccion, { foreignKey: 'ID_Seccion' });
//Seccion - Usuario:
Seccion.belongsToMany(Usuario, { through: UsuarioSeccion, foreignKey: 'ID_Seccion' });
Usuario.belongsToMany(Seccion, { through: UsuarioSeccion, foreignKey: 'ID_Usuario' });
//Seccion - Jornada:
Seccion.belongsTo(Jornada, { foreignKey: 'ID_Jornada' });
Jornada.hasMany(Seccion, { foreignKey: 'ID_Jornada' });
//UsuarioSeccion - Usuario:
UsuarioSeccion.belongsTo(Usuario, { foreignKey: 'ID_Usuario' });
Usuario.hasMany(UsuarioSeccion, { foreignKey: 'ID_Usuario' });
//UsuarioSeccion - Seccion:
UsuarioSeccion.belongsTo(Seccion, { foreignKey: 'ID_Seccion' });
Seccion.hasMany(UsuarioSeccion, { foreignKey: 'ID_Seccion' });

module.exports = {
  sequelize,Sede, Edificio, Escuela, Usuario, Carrera, Asignatura,Seccion, Examen, Sala, Modulo, Reserva, Rol, Estado, ReservaModulo, Jornada, CarreraJornada, UsuarioCarrera, UsuarioSeccion, 
};