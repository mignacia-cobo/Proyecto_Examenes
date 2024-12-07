const express = require('express');
const router = express.Router();
const multer = require("multer");
const controller = require('../controller/Controller');


// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
    },
  });
  
  const upload = multer({ storage });

//SALAS
router.get('/salas/todo', controller.obtenerSalasConfirmadasC); 
router.get('/salas/id/:id', controller.obtenerSalaPorIdC);
router.put('/salas/up/:id', controller.actualizarSalaC);
router.post('/salas/', controller.guardarSalaC);
router.delete('/salas/del/:id', controller.handleEliminarSalaIDC);
// Ruta para actualizar el estado de una sala
router.put('/salas/estado/:ID_Sala/:ID_Estado', controller.actualizarEstadoSalaC);

//MODULOS
router.get('/modulos/todo', controller.obtenerModulosC);
router.get('/modulos/id/:id', controller.obtenerModuloPorIdC);
router.put('/modulos/up/:id', controller.actualizarModuloC);
router.post('/modulos', controller.guardarModuloC);
router.delete('/modulos/del/:id', controller.eliminarModuloPorIDC);

//EDIFICIOS
router.get('/edificio/todo', controller.obtenerEdificiosC);

//ESTADOS
router.get('/estados/todo', controller.obtenerEstadosC);

// RESERVAS
router.post('/reservas', controller.crearReservaC);
router.get('/reservas/todo', controller.obtenerReservasC);
router.get('/reservas/fecha/:fecha', controller.obtenerReservasPorFechaC);
router.get('/reservas/sala/:ID_Sala', controller.obtenerReservasPorSalaC);

// Exámenes
router.get('/examenes/todo', controller.obtenerExamenesC);

// Reservas
router.post('/reservas', controller.crearReservaC);

//Alumnos
router.get('/alumnos/todo', controller.obtenerAlumnosC);

//Docentes
router.get('/docentes/todo', controller.obtenerDocentesC);

//CARGA INICIAL
router.post("/archivo/upload", upload.single("file"), controller.procesarArchivoC);
router.post("/archivo/confirmar", controller.confirmarDatosC);

//UAURIOS ALUMNOS CARGA MASIVA
router.post("/alumnos/upload", upload.single("file"), controller.cargarALumnosC);
router.post("/alumnos/confirmar", controller.confirmarAlumnosC);

//UAURIOS DOCENTES CARGA MASIVA
router.post("/docentes/upload", upload.single("file"), controller.cargarDocentesC);
router.post("/docentes/confirmar", controller.confirmarDocentesC);

module.exports = router;