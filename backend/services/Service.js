// services.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log
});

const { Jornada,Sede, Edificio, Escuela, Usuario, Modulo, Carrera, Estado, Sala, Rol, Reserva, Asignatura, Examen , ReservaModulo, CarreraJornada, Seccion, UsuarioSeccion} = require('../models/Models');

//CARGAR ALUMNOS
const insertarAlumnosMasivamente = async (datos) => {
  try {
    for (const row of datos) {
      if (!row.rut || !row.nombre || !row.seccion) {
        throw new Error(`Datos incompletos: ${JSON.stringify(row)}`);
      }
      // Buscar la sección correspondiente
      const seccion = await Seccion.findOne({ where: { Nombre_Seccion: row.seccion } });
      if (!seccion) {
        console.warn(`La sección ${row.seccion} no existe. El usuario ${row.rut} no será agregado.`);
        continue; // Ignorar este usuario y pasar al siguiente
      }
      // Crear o encontrar el usuario
      const [usuario] = await Usuario.findOrCreate({
        where: { Rut: row.rut }, // Buscar duplicados por RUT
        defaults: {
          Username: row.user,
          Password: row.pass,
          Nombre: row.nombre,
          Rut: row.rut,
          Email: row.email,
          ID_Rol: 0, // Rol predeterminado para alumnos
          ID_Estado: 1, // Estado predeterminado (Activo)
        },
      });
      await UsuarioSeccion.findOrCreate({
        where: {
          ID_Usuario: usuario.ID_Usuario,
          ID_Seccion: seccion.ID_Seccion,
        },
      });
    }
    return { message: 'Usuarios cargados con éxito.' };
  } catch (error) {
    console.error('Error al insertar usuarios:', error);
    throw new Error('Error al insertar usuarios: ' + error.message);
  }
};

//CARGAR DOCENTES
const insertarDocentesMasivamente = async (datos) => {
  try {
    for (const row of datos) {
      if (!row.rut || !row.nombre) {
        throw new Error(`Datos incompletos: ${JSON.stringify(row)}`);
      }
      // Busca al usuario por su RUT
      const usuarioExistente = await Usuario.findOne({ where: { Nombre: row.nombre } });
  
      if (usuarioExistente) {
        // Si el usuario ya existe, lo actualiza
        await usuarioExistente.update({
          Username: row.user,
          Password: row.pass,
          Rut: row.rut,
          Email: row.email,
          ID_Rol: 1, // Rol predeterminado para docentes
          ID_Estado: 1, // Estado predeterminado (Activo)
        });
        
      } else {
        // Si el usuario no existe, lo crea
        const nuevoUsuario = await Usuario.create({
          Username: row.user,
          Password: row.pass,
          Nombre: row.nombre,
          Rut: row.rut,
          Email: row.email,
          ID_Rol: 1, // Rol predeterminado para docentes
          ID_Estado: 1, // Estado predeterminado (Activo)
        });
      }
    }
    return { message: 'Usuarios cargados con éxito.' };
  } catch (error) {
    console.error('Error en upsertUsuario:', error);
    throw new Error('Error al insertar o actualizar el usuario');
  }
};

//CARGA MASIVA INICIAL
// Servicio para procesar y cargar datos del archivo Excel
const insertarDatosDesdeArchivo = async (datos) => {
  try {
    for (const row of datos) {
      // Insertar en tabla Escuela
      const [escuela] = await Escuela.findOrCreate({
        where: { Nombre: row.escuela },
        defaults: { ID_Sede: 1, ID_Estado: 1 },
      });

      // Insertar en tabla Jornada
      const [jornada] = await Jornada.findOrCreate({
        where: { Nombre: row.jornada },
      });

      // Insertar en tabla Carrera
      const [carrera] = await Carrera.findOrCreate({
        where: { Nombre: row.carrera },
        defaults: { ID_Escuela: escuela.ID_Escuela, ID_Jornada: jornada.ID_Jornada, ID_Estado: 1 },
      });

      // Insertar en tabla Asignatura
      const [asignatura] = await Asignatura.findOrCreate({
        where: { Nombre_Asignatura: row.asignatura },
        defaults: { Nivel: row.nivel, ID_Carrera: carrera.ID_Carrera },
      });

      // Insertar en tabla CarreraJornada
      await CarreraJornada.findOrCreate({
        where: { 
          ID_Carrera: carrera.ID_Carrera, 
          ID_Jornada: jornada.ID_Jornada 
        },
      });

      // Insertar en tabla Sección
      const [seccion] = await Seccion.findOrCreate({
        where: { Nombre_Seccion: row.seccion },
        defaults: {
          ID_Asignatura: asignatura.ID_Asignatura,
          ID_Jornada: jornada.ID_Jornada,
        },
      });

      // Insertar en tabla Usuario
      const [usuario] = await Usuario.findOrCreate({
        where: { Nombre: row.docente },
        defaults: {
          Username: '', // Opcional, vacío
          Password: '1234', // Opcional, vacío
          Nombre: row.docente,
          Rut: '', // Opcional, vacío
          Email: '', // Opcional, vacío
          ID_Rol: 1, // Docente
          ID_Estado: 1, // Activo
          //Telefono: '', // Opcional, vacío
        },
      });

      // Insertar en tabla UsuarioSeccion
      await UsuarioSeccion.findOrCreate({
        where: {
          ID_Seccion: seccion.ID_Seccion,
          ID_Usuario: usuario.ID_Usuario,
        },
      });

      // Insertar en tabla CarreraJornada
      await CarreraJornada.findOrCreate({
        where: {
          ID_Carrera: carrera.ID_Carrera,
          ID_Jornada: jornada.ID_Jornada,
        },
      });

      // Insertar en tabla Examen
      await Examen.create({
        Nombre_Examen: row.asignatura,
        ID_Asignatura: asignatura.ID_Asignatura,
        ID_Seccion: seccion.ID_Seccion,
        Inscritos: row.inscritos,
        Tipo_Procesamiento: row.tipoProcesamiento,
        Plataforma_Procesamiento: row.plataformaProcesamiento,
        Situacion_Evaluativa: row.situacionEvaluativa,
        Cantidad_Modulos: row.tiempoAsignado,
        ID_Estado: 4, // Asumimos 4 como estado por defecto
      });
    }

    console.log("Datos insertados correctamente");
    return { message: "Datos insertados correctamente" };
  } catch (error) {
    console.error("Error al insertar los datos:", error);
    throw new Error("Error al insertar los datos");
  }
};


//ACTUALIZAR ESTADO DE UNA SALA AL SELECCIONARLA PARA RESERVAR
const actualizarEstadoSala = async (ID_Sala, ID_Estado) => {
  try {
    console.log('Actualizando sala:', ID_Sala, 'con estado:', ID_Estado); // Log para depuración
    const sala = await Sala.findByPk(ID_Sala);
    if (!sala) {
      throw new Error('Sala no encontrada');
    }

    sala.ID_Estado = ID_Estado;
    await sala.save();

    return sala;
  } catch (error) {
    console.error('Error al actualizar el estado de la sala:', error); // Log del error
    throw error;
  }
};
  

//CREAR RESERVA CON MODULOS
async function crearReservaConModulos(data) {
  console.log('Creando reserva con módulos:', data);
  try {
    
    const { Fecha, ID_Sala, ID_Examen, Modulos } = data;
    console.log('Creando reserva con módulos service.js:', data);
    // Validar los datos entrantes
    // if (!fecha || !ID_Sala || !ID_Examen || !Array.isArray(modulos) || modulos.length === 0) {
    //  console.error('Datos incompletos:', data);
    //  throw new Error('Datos incompletos. Se requiere fecha, ID_Sala, ID_Examen y al menos un módulo.',fecha, ID_Sala, ID_Examen ,modulos);
    //}
    
    // Crear la nueva reserva
    const nuevaReserva = await Reserva.create({
      Fecha,
      ID_Sala,
      ID_Examen,
    });

    // Preparar los datos para insertar en la tabla intermedia ReservaModulo
    const modulosReservados = Modulos.map((modulo) => {
      if (!modulo.ID_Modulo) {
        throw new Error('Cada módulo debe tener un ID_Modulo.');
      }
      return {
        ID_Reserva: nuevaReserva.ID_Reserva,
        ID_Modulo: modulo.ID_Modulo,
      };
    });

    await Examen.update(
      { ID_Estado: 3 },
      { where: { ID_Examen } }
    );

    // Insertar los módulos asociados a la reserva
    await ReservaModulo.bulkCreate(modulosReservados);

    // Retornar la nueva reserva con los módulos asociados para confirmar
    const reservaConModulos = await Reserva.findByPk(nuevaReserva.ID_Reserva, {
      include: [
        { model: Modulo, through: { attributes: [] } }, // Incluye los módulos asociados
        { model: Sala, attributes: ['Nombre_sala', 'Codigo_sala'] }, // Incluye detalles de la sala
        { model: Examen, attributes: ['Nombre_Examen'] }, // Incluye detalles del examen
      ],
    });

    return reservaConModulos;
  } catch (error) {
    console.error('Error al crear la reserva con módulos:', error);
    throw error; // Re-lanzar el error para que el controlador lo maneje
  }
}


// Verificar disponibilidad de la sala
const verificarDisponibilidad = async (ID_Sala, Fecha, ID_Modulo) => {
  const reserva = await Reserva.findOne({ where: { ID_Sala, Fecha, ID_Modulo } });
  return !reserva; // Devuelve true si no hay reserva
};

// Reservar sala
const reservarSala = async (datosReserva) => {
  const disponibilidad = await verificarDisponibilidad(datosReserva.ID_Sala, datosReserva.Fecha, datosReserva.ID_Modulo);
  if (!disponibilidad) {
    throw new Error('La sala ya está reservada para este módulo y fecha.');
  }
  return await Reserva.create(datosReserva);
};

// Obtener exámenes
const obtenerExamenes = async () => {
  try {
    const examenes = await Examen.findAll({
      include: [
        {
          model: Asignatura,
          attributes: ['Nombre_Asignatura'], // Solo devuelve el nombre de la asignatura
        },
        {
          model: Seccion,
          attributes: ['Nombre_Seccion'], // Solo devuelve el nombre de la sección
        },
        {
          model: Estado,
          attributes: ['Nombre'], // Solo devuelve el nombre del estado
        }
      ],
    });
    return examenes;
  } catch (error) {
    console.error('Error al obtener exámenes:', error);
    throw error;
  }
};

//Obtener Alumnos
const obtenerAlumnos = async () => {
  try {
    const alumnos = await Usuario.findAll({
      where: { ID_Rol: 0 }, // Filtrar por rol de alumnos
    });
    return alumnos;
  } catch (error) {
    console.error('Error al obtener los alumnos:', error);
    throw error;
  }
};

//Obtener Docentes
const obtenerDocentes = async () => {
  try {
    const docentes = await Usuario.findAll({
      where: {
        ID_Rol: 1,
        [Sequelize.Op.and]: [
          Sequelize.where( // Filtrar por RUT válido
            Sequelize.fn('LENGTH', Sequelize.col('Rut')), // Obtener la longitud del RUT
            { [Sequelize.Op.gt]: 2 } // Rut debe tener más de 2 caracteres
          ),
          { Rut: { [Sequelize.Op.ne]: null } } // Excluir nulos
        ]
      }
    });
    return docentes;
  } catch (error) {
    console.error('Error al obtener los docentes:', error);
    throw error;
  }
};

// Crear reserva
const crearReserva = async (reservaData) => {
  try {
    const nuevaReserva = await Reserva.create(reservaData);
    return nuevaReserva;
  } catch (error) {
    console.error('Error al crear reserva:', error);
    throw error;
  }
};


// Obtener reservas por fecha
const obtenerReservasPorFecha = async (Fecha) => {
  return await Reserva.findAll({
    where: { Fecha },
    include: [
      { model: Sala, attributes: ['Nombre_Sala'] },
      { model: Modulo, attributes: ['Numero', 'Hora_Inicio', 'Hora_Final'] },
      { model: Examen, include: [{ model: Asignatura, attributes: ['Nombre_Asignatura'] }] }
    ],
  });
};

//OBETENER RESERVAS POR SALA
const obtenerReservasPorSala = async (id) => {
  try  {
    if (!id) {
      throw new Error('El ID_Sala proporcionado es inválido o está vacío.');
    }
    const reservas = await Reserva.findAll({
      where: { ID_Sala: id },
      include: [
        {
          model: Modulo,
          through: { attributes: [] },
          attributes: ['ID_Modulo', 'Numero', 'Hora_inicio', 'Hora_final'],
        },
        {
          model: Examen,
          attributes: ['Nombre_Examen',  'Cantidad_Modulos'],
          include: [
            {
              model: Asignatura,
              attributes: ['Nombre_Asignatura'],
            },
            {
              model: Seccion,
              attributes: ['Nombre_Seccion'],
              include: [
                  {
                    model: Usuario,
                    through: UsuarioSeccion,
                    attributes: ['Nombre', 'Rut', 'Email'],
                    where: { ID_Rol: 1 }, // Filtrar usuarios con rol 1
                  }
              ],
            },
          ],
        },
      ],
    });
    return reservas;
  } catch (error) {
    console.error('Error al obtener reservas por sala:', error);
    throw new Error('Error al obtener las reservas por sala');
  }
};

// Obtener todas las reservas
const obtenerReservas = async () => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        {
          model: Modulo,
          through: { attributes: [] },
          attributes: ['ID_Modulo', 'Numero', 'Hora_inicio', 'Hora_final'],
        },
        {
          model: Examen,
          attributes: ['Nombre_Examen',  'Cantidad_Modulos'],
          include: [
            {
              model: Asignatura,
              attributes: ['Nombre_Asignatura'],
            },
            {
              model: Seccion,
              attributes: ['Nombre_Seccion'],
              include: [
                  {
                    model: Usuario,
                    through: UsuarioSeccion,
                    attributes: ['Nombre', 'Rut', 'Email'],
                    where: { ID_Rol: 1 }, // Filtrar usuarios con rol 1
                  }
              ],
            },
          ],
        },
      ],
    });
    return reservas;
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw new Error('Error al obtener reservas');
  }
};


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
  verificarDisponibilidad,
  reservarSala,
  obtenerReservasPorFecha,
  obtenerReservas,
  crearReserva,
  obtenerExamenes,
  crearReservaConModulos,
  actualizarEstadoSala,
  insertarDatosDesdeArchivo,
  insertarAlumnosMasivamente,
  obtenerAlumnos,
  insertarDocentesMasivamente,
  obtenerDocentes,
  obtenerReservasPorSala,
};
