const Modulo = require('../models/Modulo');

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
};