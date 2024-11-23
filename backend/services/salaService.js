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
    console.log('Sala:', sala);
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

const eliminarSalaPorID = async (ID_Sala) => {
  try {
      const result = await Sala.destroy({ where: { ID_Sala } });
      return result;
  } catch (error) {
      throw new Error('Error al eliminar la sala');
  }
};


const obtenerModuloPorId = async (id) => {
  try {
    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      throw new Error('Modulo no encontrado');
    }
    return modulo;
  } catch (error) {
    throw new Error('Error al obtener el modulo');
  }
};

const actualizarModulo = async (id, moduloActualizado) => {
  try {
    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      throw new Error('Modulo no encontrado');
    }
    await modulo.update(moduloActualizado);
    return modulo;
  } catch (error) {
    throw new Error('Error al actualizar el modulo');
  }
};

const obtenerModulos = async () => {
  try {
    return await Modulo.findAll();
  } catch (error) {
    throw new Error('Error al obtener los modulos');
  }
};

const guardarModulo = async (moduloData) => {
  try {
    const nuevoModulo = await Modulo.create(moduloData);
    return nuevoModulo;
  } catch (error) {
    throw new Error('Error al guardar el modulo');
  }
};

const eliminarModuloPorID = async (id) => {
  try {
    const result = await Modulo.destroy({ where: { id } });
    return result;
  } catch (error) {
      throw new Error('Error al eliminar el modulo');
  }
};

module.exports = {
  obtenerModuloPorId,
  actualizarModulo,
  obtenerModulos,
  guardarModulo,
  eliminarModuloPorID,
  obtenerSalaPorId,
  actualizarSala,
  obtenerSalasConfirmadas,
  guardarSala,
  eliminarSalaPorID,
};

