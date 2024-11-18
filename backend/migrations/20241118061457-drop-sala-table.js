'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Salas');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Salas', {
      ID_Sala: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Codigo_sala: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Nombre_sala: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Edificio_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    });
  }
};
