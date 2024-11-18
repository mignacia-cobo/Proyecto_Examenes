const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const {conectarDB} = require('./database');
const salaRoutes = require('./routes/salaRoutes');
const Sala = require('./models/Sala');

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());

// Conectar a la base de datos
conectarDB();

// Sincronizar modelos
Sala.sync();

// Usar las rutas de sala
app.use('/api/salas', salaRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  res.status(500).send({ message: 'Error interno del servidor', error: err.message });
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});