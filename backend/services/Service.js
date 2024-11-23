// services.js
const { Modulo, Sala, Edificio } = require('../models/Models');

// Servicios para Modulo
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

// Servicios para Sala
const obtenerSalaPorId = async (id) => {
  try {
    const sala = await Sala.findByPk(id);
    if (!sala) {
      throw new Error('Sala no encontrada');
    }
    return sala;
  } catch (error) {
    throw new Error('Error al obtener la sala');
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

const obtenerSalas = async () => {
  try {
    return await Sala.findAll();
  } catch (error) {
    throw new Error('Error al obtener las salas');
  }
};

const guardarSala = async (salaData) => {
  try {
    const nuevaSala = await Sala.create(salaData);
    return nuevaSala;
  } catch (error) {
    throw new Error('Error al guardar la sala');
  }
};

const eliminarSalaPorID = async (id) => {
  try {
    const result = await Sala.destroy({ where: { id } });
    return result;
  } catch (error) {
    throw new Error('Error al eliminar la sala');
  }
};

// Servicios para Edificio
const obtenerEdificios = async () => {
  try {
    const edificios = await Edificio.findAll();
    console.log('Obteniendo edificios:', edificios);
    return edificios;
  } catch (error) {
    console.error('Error al obtener los edificios:', error);
    throw new Error('Error al obtener las edificio');
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
  obtenerSalas,
  guardarSala,
  eliminarSalaPorID,
  obtenerEdificios,
};