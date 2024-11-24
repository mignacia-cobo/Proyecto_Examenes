// services.js
const { Sede, Edificio, Escuela, Usuario, Modulo, Carrera, Estado, Sala, Rol, Reserva, Asignatura, Examen } = require('../models/Models');
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
    const modulos = await Modulo.findAll({
      include: {
        model: Estado,
        attributes: ['Nombre'],
      },
    });
    console.log('Módulos obtenidos:', modulos);
    return modulos;
  } catch (error) {
    console.error('Error al obtener los módulos:', error.message);
    console.error('Detalle del error:', error.stack);
    throw new Error('Error al obtener los módulos');
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
    const result = await Modulo.destroy({ where: { ID_Modulo : id } });
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
    return await Sala.findAll({
      include: {
        model: Edificio, // Relación con la tabla Edificio
        attributes: ['Nombre_Edificio'], // Solo obtén el nombre del edificio
      },
    });

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
    const result = await Sala.destroy({ where: { ID_Sala: id } });
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

//servicios para Estado
const obtenerEstados = async () => {
  try {
    const estados = await Estado.findAll();
    console.log('Obteniendo estados:', estados);
    return estados;
  } catch (error) {
    console.error('Error al obtener los estados:', error);
    throw new Error('Error al obtener las estados');
  }
};

//Verificar disponibilidad de salas
const verificarDisponibilidad = async (ID_Sala, Fecha, ID_Modulo) => {
  const reserva = await Reserva.findOne({
    where: { ID_Sala, Fecha, ID_Modulo }
  });
  return !reserva; // Devuelve true si no hay reserva
};


//Reservas en un dia
const obtenerReservasPorFecha = async (Fecha) => {
  return await Reserva.findAll({
    where: { Fecha },
    include: [
      { model: Sala, attributes: ['Nombre_Sala'] },
      { model: Modulo, attributes: ['Numero', 'Hora_Inicio', 'Hora_Final'] },
      { model: Examen, include: [{ model: Asignatura, attributes: ['Nombre_Asignatura'] }] }
    ]
  });
};
//Realizar reservas 
const reservarSala = async (datosReserva) => {
  const disponibilidad = await verificarDisponibilidad(datosReserva.ID_Sala, datosReserva.Fecha, datosReserva.ID_Modulo);
  if (!disponibilidad) {
    throw new Error('La sala ya está reservada para este módulo y fecha.');
  }
  return await Reserva.create(datosReserva);
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
  obtenerEstados,
};
