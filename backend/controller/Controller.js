const {
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
  } = require('../services/service');

// Controladores para Sala
const obtenerSalaPorIdC = async (req, res) => {
  try {
    const id = req.params.id;
    const sala = await obtenerSalaPorId(id);
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

const actualizarSalaC = async (req, res) => {
  try {
    const id = req.params.id;
    const salaActualizada = req.body;
    const sala = await actualizarSala(id, salaActualizada);
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

const obtenerSalasConfirmadasC = async (req, res) => {
  try {
    const salas = await obtenerSalas();
    res.json(salas);
  } catch (error) {
    console.error('Error obteniendo las salas:', error);
    res.status(500).json({ message: 'Error al obtener las salas' });
  }
};

const guardarSalaC = async (req, res) => {
  const salaData = req.body;
  console.log('Datos recibidos en el controlador:', salaData);
  try {
    const nuevaSala = await guardarSala(salaData);
    res.status(201).json({ message: 'Sala guardada exitosamente', sala: nuevaSala });
  } catch (error) {
    console.error('Error al guardar la sala:', error);
    res.status(500).json({ message: 'Error al guardar la sala', error: error.message });
  }
};

const handleEliminarSalaIDC = async (req, res) => {
  const id = req.params.id;
  console.log('ID de la sala a eliminar controller1:', id);
  try {
    const salaEliminada = await eliminarSalaPorID(id);
    console.log('Sala eliminada resultado :', salaEliminada);
    res.status(200).json({ message: 'Sala eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la sala:', error);
    res.status(500).json({ error: 'Error al eliminar la sala' });
  }
};

// Controladores para Modulo
const obtenerModuloPorIdC = async (req, res) => {
  try {
    const id = req.params.id;
    const modulo = await obtenerModuloPorId(id);
    if (modulo) {
      res.status(200).json(modulo);
    } else {
      res.status(404).json({ message: 'Modulo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const actualizarModuloC = async (req, res) => {
  try {
    const id = req.params.id;
    const moduloActualizado = req.body;
    const modulo = await actualizarModulo(id, moduloActualizado);
    if (modulo) {
      res.status(200).json(modulo);
    } else {
      res.status(404).json({ message: 'Modulo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const obtenerModulosC = async (req, res) => {
  try {
    const modulos = await obtenerModulos();
    res.json(modulos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los modulos' });
  }
};

const guardarModuloC = async (req, res) => {
  const moduloData = req.body;
  try {
    const nuevoModulo = await guardarModulo(moduloData);
    res.status(201).json({ message: 'Modulo guardado exitosamente', modulo: nuevoModulo });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el modulo', error: error.message });
  }
};

const eliminarModuloPorIDC = async (req, res) => {
  const { id } = req.params;
  try {
    const moduloEliminado = await eliminarModuloPorID(id);
    console.log('Modulo eliminado:', moduloEliminado);
    res.status(200).json({ message: 'Modulo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el modulo' });
  }
};

//Edificios
const obtenerEdificiosC = async (req, res) => {
  try {
      const edificios = await obtenerEdificios();
      res.status(200).json(edificios);
  } catch (error) {
      console.error('Error en obtenerEdificiosC:', error.message);
      res.status(500).json({ mensaje: 'Error al obtener los edificios' });
  }
};

module.exports = {
  obtenerSalaPorIdC,
  actualizarSalaC,
  obtenerSalasConfirmadasC,
  guardarSalaC,
  handleEliminarSalaIDC,
  obtenerModuloPorIdC,
  actualizarModuloC,
  obtenerModulosC,
  guardarModuloC,
  eliminarModuloPorIDC,
  obtenerEdificiosC,
};