const express = require('express');
const router = express.Router();
const salaController = require('../controller/salaController');
const moduloController = require('../controller/moduloController');

//SALAS
router.get('/salas/todo', salaController.obtenerSalasConfirmadas); 
router.get('/salas/id/:id', salaController.obtenerSalaPorId);
router.put('/salas/up/:id', salaController.actualizarSala);
router.post('/salas/', salaController.guardarSala);
router.delete('/salas/:id', salaController.handleEliminarSalaID);

//MODULOS
router.get('/modulos/todo', moduloController.obtenerModulos);
router.get('/modulos/id/:id', moduloController.obtenerModuloPorId);
router.put('/modulos/up/:id', moduloController.actualizarModulo);
router.post('/modulos', moduloController.guardarModulo);
router.delete('/modulos/:id', moduloController.eliminarModuloPorID);


module.exports = router;