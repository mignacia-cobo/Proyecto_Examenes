const Sala = require('../models/Sala');

const obtenerSalaPorId = async (id) => {
  try {
    const sala = await Sala.findByPk(id);
    console.log('Sala:', sala);
    if (!sala) {
      throw new Error('Sala no encontrada');
    }
    return sala;
  } catch (error) {
    throw new Error('Error al obtener la sala service');
  }
};

const actualizarSala = async (id, salaActualizada) => {
  try {
    const sala = await Sala.findByPk(id);
    if (!sala) {
      throw new Error('Sala no encontrada');
    }
    await sala.update(salaActualizada);
    return sala;
  } catch (error) {
    throw new Error('Error al actualizar la sala');
  }
};

const obtenerSalasConfirmadas = async () => {
  try {
    return await Sala.findAll();
  } catch (error) {
    console.error('Error obteniendo todas las salas:', error);
    throw error;
  }
};

const guardarSala = async (salaData) => {
  try {
    const nuevaSala = await Sala.create(salaData);
    return nuevaSala;
  } catch (error) {
    throw new Error('Error al guardar la sala: ' + error.message);
  }
};

module.exports = {
  obtenerSalaPorId,
  actualizarSala,
  obtenerSalasConfirmadas,
  guardarSala,
};