const express = require('express');
const { conectarDB, sequelize } = require('./database');
const Sala = require('../src/models/Sala');

const app = express();
const port = 3000;

app.use(express.json());

// Conectar a la base de datos
conectarDB();

// Sincronizar modelos
Sala.sync();

let salas = [
  { id: 1, codigo: 'A101', nombre: 'Sala 1', capacidad: 30, edificio: 'Edificio A' },
  { id: 2, codigo: 'B202', nombre: 'Sala 2', capacidad: 20, edificio: 'Edificio B' },
  // otras salas
];

// Ruta para verificar la conexión a la base de datos
app.get('/api/check-db', async (req, res) => {
  try {
    await Sala.findAll();
    res.send('La base de datos es accesible.');
  } catch (error) {
    res.status(500).send('Error al acceder a la base de datos.');
  }
});

// Ruta para obtener una sala por su ID
app.get('/api/salas/:id', (req, res) => {
  const sala = salas.find(s => s.id === parseInt(req.params.id));
  if (!sala) return res.status(404).send('La sala no fue encontrada.');
  res.send(sala);
});

// Ruta para actualizar una sala por su ID
app.put('/api/salas/:id', (req, res) => {
  const sala = salas.find(s => s.id === parseInt(req.params.id));
  if (!sala) return res.status(404).send('La sala no fue encontrada.');

  sala.codigo = req.body.codigo;
  sala.nombre = req.body.nombre;
  sala.capacidad = req.body.capacidad;
  sala.edificio = req.body.edificio;

  res.send(sala);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});