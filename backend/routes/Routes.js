const express = require('express');
const router = express.Router();
const controller = require('../controller/Controller');


//SALAS
router.get('/salas/todo', controller.obtenerSalasConfirmadasC); 
router.get('/salas/id/:id', controller.obtenerSalaPorIdC);
router.put('/salas/up/:id', controller.actualizarSalaC);
router.post('/salas/', controller.guardarSalaC);
router.delete('/salas/del/:id', controller.handleEliminarSalaIDC);

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

module.exports = router;