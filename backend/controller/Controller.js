const xlsx = require("xlsx");
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
    obtenerEstados,
    reservarSala, 
    obtenerReservasPorFecha,
    verificarDisponibilidad,
    obtenerReservas,
    crearReserva,
    obtenerExamenes,
    crearReservaConModulos,
    actualizarEstadoSala,
    insertarDatosDesdeArchivo,
  
  } = require('../services/Service');


//CARGA MASIVA INICAL
const procesarArchivoC = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const datos = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const datosProcesados = datos.map(row => ({
      escuela: row["Escuela"],
      jornada: row["Jornada"],
      carrera: row["Carrera Genérica"],
      asignatura: row["Nom. Asignatura"],
      nivel: row["Nivel"],
      seccion: row["Sección"],
      inscritos: row["Inscritos (Sábana)"],
      tipoProcesamiento: row["Tipo de Procesamiento"],
      plataformaProcesamiento: row["Plataforma de Procesamiento"],
      situacionEvaluativa: row["Situación Evaluativa"],
      tiempoAsignado: row["Tiempo Asignado (módulos)"],
    }));

    res.json(datosProcesados);
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ error: "Error al procesar el archivo" });
  }
};

const confirmarDatosC = async (req, res) => {
  try {
    await insertarDatosDesdeArchivo(req.body.datos);
    res.json({ message: "Datos confirmados y cargados correctamente" });
  } catch (error) {
    console.error("Error al confirmar los datos:", error);
    res.status(500).json({ error: "Error al confirmar los datos" });
  }
};


//ACTUALIZAR ESTADO DE UNA SALA CUANDO ES SEELCCIONADA
const actualizarEstadoSalaC = async (req, res) => {
  console.log('Actualizando estado de la sala: ', req.params);
  const { ID_Sala, ID_Estado } = req.params; // Obtener datos del cuerpo de la solicitud
  console.log('Datos recibidos en el controlador:', ID_Sala, ID_Estado);

  if (!ID_Sala || ID_Estado === undefined) {
    return res.status(400).json({ message: 'ID_Sala e ID_Estado son requeridos' });
  }

  try {
    const salaActualizada = await actualizarEstadoSala(ID_Sala, ID_Estado);
    return res.json({ message: 'Estado de la sala actualizado', sala: salaActualizada });
  } catch (error) {
    console.error('Error al actualizar el estado de la sala:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la sala' });
  }
};


// Obtener exámenes
const obtenerExamenesC = async (req, res) => {
  try {
    const examenes = await obtenerExamenes();
    res.status(200).json(examenes);
  } catch (error) {
    console.error('Error al obtener exámenes:', error);
    res.status(500).json({ message: 'Error al obtener exámenes' });
  }
};

// Crear reserva
async function crearReservaC(req, res) {
  try {
    const reserva = await crearReservaConModulos(req.body);
    console.log('Reserva creada:', reserva);
    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reserva.' });
  }
}
// Obtener reservas por fecha
const obtenerReservasPorFechaC = async (req, res) => {
  const { fecha } = req.params;
  try {
    const reservas = await obtenerReservasPorFecha(fecha);
    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas por fecha:', error.message);
    res.status(500).json({ message: 'Error al obtener reservas', error: error.message });
  }
};

// Controlador para obtener todas las reservas
const obtenerReservasC = async (req, res) => {
  try {
    const reservas = await obtenerReservas(); // Llama al servicio que definimos previamente
    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener todas las reservas:', error.message);
    res.status(500).json({ message: 'Error al obtener reservas', error: error.message });
  }
};

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
    console.error('Error obteniendo los modulos:', error);
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

//Estados
const obtenerEstadosC = async (req, res) => {
  try {
      const estados = await obtenerEstados();
      res.status(200).json(estados);
  } catch (error) {
      console.error('Error en obtenerEstadosC:', error.message);
      res.status(500).json({ mensaje: 'Error al obtener los estados' });
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
  obtenerEstadosC,
  crearReservaC,
  obtenerReservasPorFechaC,
  obtenerReservasC,
  obtenerExamenesC,
  actualizarEstadoSalaC,
  procesarArchivoC,
  confirmarDatosC,
};