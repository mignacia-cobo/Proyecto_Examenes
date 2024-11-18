const Sala = require('../models/Sala');
const salaService = require('../services/salaService');

// Obtener una sala por ID
const obtenerSalaPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const sala = await salaService.obtenerSalaPorId(id);
    if (sala) {
      res.status(200).json(sala);
      console.log('Sala:', sala);
    } else {
      res.status(404).json({ message: 'Sala no encontrada' });
    }
  } catch (error) {
    console.error('Error obteniendo la sala:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar una sala
const actualizarSala = async (req, res) => {
  try {
    const id = req.params.id;
    const salaActualizada = req.body;
    const sala = await salaService.actualizarSala(id, salaActualizada);
    if (sala) {
      res.status(200).json(sala);
    } else {
      res.status(404).json({ message: 'Sala no encontrada' });
    }
  } catch (error) {
    console.error('Error actualizando la sala:', error);
    res.status(500).json({ message: 'Error interno del servidor actualizar' });
  }
};

// Obtener todas las salas
const obtenerSalasConfirmadas = async (req, res) => {
  try {
    const salas = await Sala.findAll(); // Obtener todas las salas
    res.json(salas);
  } catch (error) {
    console.error('Error obteniendo las salas:', error);
    res.status(500).json({ message: 'Error al obtener las salas' });
  }
};

// Guardar una sala
const guardarSala = async (req, res) => {
  const salaData = req.body;
  console.log('Datos recibidos en el controlador:', salaData);
  try {
    const nuevaSala = await salaService.guardarSala(salaData);
    res.status(201).json({ message: 'Sala guardada exitosamente', sala: nuevaSala });
  } catch (error) {
    console.error('Error al guardar la sala:', error);
    res.status(500).json({ message: 'Error al guardar la sala', error: error.message });
  }
};

//Eliminar sala por ID
const handleEliminarSalaID = async (req, res) => {
  const id = req.params.id;
  console.log('ID de la sala a eliminar controller1:', id);
  try {
    const salaEliminada = await salaService.eliminarSalaPorID(id);
    console.log('Sala eliminada resultado :', salaEliminada);
    res.status(200).json({ message: 'Sala eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la sala:', error);
    res.status(500).json({ error: 'Error al eliminar la sala' });
  }
};

module.exports = {
  obtenerSalaPorId,
  actualizarSala,
  obtenerSalasConfirmadas,
  guardarSala,
  handleEliminarSalaID,
};