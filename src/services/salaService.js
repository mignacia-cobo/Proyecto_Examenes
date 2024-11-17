const Sala = require('../models/Sala');

const actualizarSala = async (id, salaActualizada) => {
  try {
    const sala = await Sala.findByPk(id);
    if (sala) {
      await sala.update(salaActualizada);
      return sala;
    } else {
      throw new Error('Sala no encontrada');
    }
  } catch (error) {
    console.error('Error actualizando la sala:', error);
    throw error;
  }
};

module.exports = actualizarSala;