const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const Routes = require('./routes/Routes'); // Rutas principales
const { sequelize,conectarDB, inicializarBaseDeDatos } = require('./database'); // Conexión a la base de datos y funciones

const app = express();
const port = 3000;

// Middleware
app.use(cors());
//app.use(express.json());
// Middleware para aumentar el límite de la solicitud
app.use(express.json({ limit: '100mb' })); // Cambia el límite según lo necesites
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Función para inicializar la aplicación
const iniciarServidor = async () => {
  try {
    
    // Conectar a la base de datos
    await conectarDB();

    // Sincronizar la base de datos
    await sequelize.sync({ alter: true }) // Usa `alter` para evitar borrar datos existentes
    .then(() => console.log("Base de datos sincronizada correctamente."))
    .catch((err) => console.error("Error al sincronizar la base de datos:", err));

    sequelize.getQueryInterface().showAllSchemas()
    .then((tables) => {
      console.log("Tablas en la base de datos:", tables);
    })
    .catch((err) => {
      console.error("Error al obtener las tablas:", err);
    });


    // Inicializar valores por defecto
    await inicializarBaseDeDatos();

    // Configurar rutas
    app.use('/api', Routes);

    // Middleware de manejo de errores
    app.use((err, req, res, next) => {
      console.error('Error:', err.message);
      console.error(err.stack);
      res.status(500).send({ message: 'Error interno del servidor', error: err.message });
    });

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1); // Detener la ejecución si hay un error crítico
  }
};

// Llama a la función para iniciar el servidor
iniciarServidor();
