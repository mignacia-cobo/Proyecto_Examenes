/* const { sequelize } = require('./database'); // Asegúrate de que la ruta sea correcta

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Todas las tablas han sido eliminadas y recreadas.');
  } catch (error) {
    console.error('Error al sincronizar las tablas:', error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();*/