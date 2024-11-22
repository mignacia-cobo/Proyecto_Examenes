const express = require('express');
const cors = require('cors'); // Importa el paquete cors
//const {conectarDB} = require('./database');
const Routes = require('./routes/Routes');
//const { sequelize } = require('./models/Models');
const { sequelize, conectarDB } = require('./database');

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());

// Conectar a la base de datos
conectarDB();

// Sincronizar la base de datos
sequelize.sync({ force: false });

// Usar las rutas de sala
app.use('/api', Routes);
//app.use('/api/modulos', Routes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  res.status(500).send({ message: 'Error interno del servidor', error: err.message });
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});