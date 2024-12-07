const { Sequelize } = require('sequelize');
const { sequelize,Estado, Sede, Edificio, Modulo,Rol} = require('./models/Models');

//const sequelize = new Sequelize({
  //dialect: 'sqlite',
  //storage: './database.sqlite',
  //logging: console.log,
//});


const conectarDB = async () => {
    try {
      await sequelize.authenticate();
      console.log('Base de datos conectada');
    } catch (error) {
      console.error('Error conectando a la base de datos:', error);
      process.exit(1);
    }
  };

  

  const inicializarBaseDeDatos = async () => {
    try {
      // Valores por defecto para `Estado`
      const estados = [
        { ID_Estado: 0, Nombre: 'Inactivo' },
        { ID_Estado: 1, Nombre: 'Activo' },
        { ID_Estado: 2, Nombre: 'Sala_Reservando' },
        { ID_Estado: 3, Nombre: 'Examen_Reservado' },
        { ID_Estado: 4, Nombre: 'Examen_Disponible' },
      ];
  
      for (const estado of estados) {
        await Estado.findOrCreate({
          where: { ID_Estado: estado.ID_Estado },
          defaults: { Nombre: estado.Nombre },
        });
      }
      console.log('Estados iniciales insertados.');
  
      // Valores por defecto para `Rol`
      const roles = [
        { ID_Rol: 0, Nombre: 'Alumno' },
        { ID_Rol: 1, Nombre: 'Docente' },
        { ID_Rol: 2, Nombre: 'Admnistrativo' },
        { ID_Rol: 3, Nombre: 'Coordinador' },
        { ID_Rol: 4, Nombre: 'Admin' },
      ];
  
      for (const rol of roles) {
        await Rol.findOrCreate({
          where: { ID_Rol: rol.ID_Rol },
          defaults: { Nombre: rol.Nombre },
        });
      }
      console.log('Roles iniciales insertados.');
  

      // Valores por defecto para `Sede`
      const sedes = [
        { ID_Sede: 1, Nombre_Sede: 'Valparaíso' },
        { ID_Sede: 2, Nombre_Sede: 'Sede Santiago' },
        { ID_Sede: 3, Nombre_Sede: 'Sede Viña del Mar' },
      ];
  
      for (const sede of sedes) {
        await Sede.findOrCreate({
          where: { ID_Sede: sede.ID_Sede },
          defaults: { Nombre_Sede: sede.Nombre_Sede },
        });
      }
      console.log('Sedes iniciales insertadas.');
  
      // Valores por defecto para `Edificio`
      const edificios = [
        { ID_Edificio: 1, Nombre_Edificio: 'Brasil 1', ID_Sede: 1 },
        { ID_Edificio: 2, Nombre_Edificio: 'Brasil 2', ID_Sede: 1 },
        { ID_Edificio: 3, Nombre_Edificio: 'Cousiño', ID_Sede: 1 },
      ];
  
      for (const edificio of edificios) {
        await Edificio.findOrCreate({
          where: { ID_Edificio: edificio.ID_Edificio },
          defaults: {
            Nombre_Edificio: edificio.Nombre_Edificio,
            ID_Sede: edificio.ID_Sede,
          },
        });
      }
      console.log('Edificios iniciales insertados.');
  
      // Valores por defecto para `Modulos`
      const modulos = [
        { ID_Modulo: 1, Numero: 1, Hora_inicio: '08:00:00', Hora_final: '08:40:00', ID_Estado: 1 },
        { ID_Modulo: 2, Numero: 2, Hora_inicio: '08:41:00', Hora_final: '09:20:00', ID_Estado: 1 },
        { ID_Modulo: 3, Numero: 3, Hora_inicio: '09:31:00', Hora_final: '10:10:00', ID_Estado: 1 },
        { ID_Modulo: 4, Numero: 4, Hora_inicio: '10:11:00', Hora_final: '10:50:00', ID_Estado: 1 },
        { ID_Modulo: 5, Numero: 5, Hora_inicio: '11:01:00', Hora_final: '11:40:00', ID_Estado: 1 },
        { ID_Modulo: 6, Numero: 6, Hora_inicio: '11:41:00', Hora_final: '12:20:00', ID_Estado: 1 },
        { ID_Modulo: 7, Numero: 7, Hora_inicio: '12:31:00', Hora_final: '13:10:00', ID_Estado: 1 },
        { ID_Modulo: 8, Numero: 8, Hora_inicio: '13:11:00', Hora_final: '13:50:00', ID_Estado: 1 },
        { ID_Modulo: 9, Numero: 9, Hora_inicio: '14:01:00', Hora_final: '14:40:00', ID_Estado: 1 },
        { ID_Modulo: 10, Numero: 10, Hora_inicio: '14:41:00', Hora_final: '15:20:00', ID_Estado: 1 },
        { ID_Modulo: 11, Numero: 11, Hora_inicio: '15:31:00', Hora_final: '16:10:00', ID_Estado: 1 },
        { ID_Modulo: 12, Numero: 12, Hora_inicio: '16:11:00', Hora_final: '16:50:00', ID_Estado: 1 },
        { ID_Modulo: 13, Numero: 13, Hora_inicio: '17:01:00', Hora_final: '17:40:00', ID_Estado: 1 },
        { ID_Modulo: 14, Numero: 14, Hora_inicio: '17:41:00', Hora_final: '18:20:00', ID_Estado: 1 },
        { ID_Modulo: 15, Numero: 15, Hora_inicio: '18:21:00', Hora_final: '19:00:00', ID_Estado: 1 },
        { ID_Modulo: 16, Numero: 16, Hora_inicio: '19:11:00', Hora_final: '19:50:00', ID_Estado: 1 },
        { ID_Modulo: 17, Numero: 17, Hora_inicio: '19:51:00', Hora_final: '20:30:00', ID_Estado: 1 },
        { ID_Modulo: 18, Numero: 18, Hora_inicio: '20:41:00', Hora_final: '21:20:00', ID_Estado: 1 },
        { ID_Modulo: 19, Numero: 19, Hora_inicio: '21:21:00', Hora_final: '22:00:00', ID_Estado: 1 },
        { ID_Modulo: 20, Numero: 20, Hora_inicio: '22:11:00', Hora_final: '22:50:00', ID_Estado: 1 },
        { ID_Modulo: 21, Numero: 21, Hora_inicio: '22:51:00', Hora_final: '23:30:00', ID_Estado: 1 },
      ];
      for (const modulo of modulos) {
        await Modulo.findOrCreate({
          where: { ID_Modulo: modulo.ID_Modulo },
          defaults: {
            Numero: modulo.Numero,
            Hora_inicio: modulo.Hora_inicio,
            Hora_final: modulo.Hora_final,
            ID_Estado: modulo.ID_Estado,
          },
        });
      }
      console.log('Módulos iniciales insertados.');

      console.log('Base de datos inicializada.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  };
  
  module.exports = { conectarDB, sequelize, inicializarBaseDeDatos };