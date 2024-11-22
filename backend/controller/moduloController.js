const moduloService = require('../services/moduloService');

// Obtener un modulo por ID
const obtenerModuloPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const modulo = await moduloService.obtenerModuloPorId(id);
    if (modulo) {
      res.status(200).json(modulo);
    } else {
      res.status(404).json({ message: 'Modulo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar un modulo
const actualizarModulo = async (req, res) => {
  try {
    const id = req.params.id;
    const moduloActualizado = req.body;
    const modulo = await moduloService.actualizarModulo(id, moduloActualizado);
    if (modulo) {
      res.status(200).json(modulo);
    } else {
      res.status(404).json({ message: 'Modulo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener todos los modulos
const obtenerModulos = async (req, res) => {
  try {
    const modulos = await moduloService.obtenerModulos();
    res.json(modulos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los modulos' });
  }
};

// Guardar un modulo
const guardarModulo = async (req, res) => {
  const moduloData = req.body;
  try {
    const nuevoModulo = await moduloService.guardarModulo(moduloData);
    res.status(201).json({ message: 'Modulo guardado exitosamente', modulo: nuevoModulo });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el modulo', error: error.message });
  }
};

// Eliminar modulo por ID
const eliminarModuloPorID = async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;
  try {
    const moduloEliminado = await moduloService.eliminarModulo(id);
    console.log('Modulo eliminado:', moduloEliminado);
    res.status(200).json({ message: 'Modulo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el modulo' });
  }
};

module.exports = {
  obtenerModuloPorId,
  actualizarModulo,
  obtenerModulos,
  guardarModulo,
  eliminarModuloPorID,
};