const express = require('express');
const router = express.Router();
const salaController = require('../controller/salaController');

router.get('/salasConfirmadas', salaController.obtenerSalasConfirmadas); 
router.get('/id/:id', salaController.obtenerSalaPorId);
router.put('/up/:id', salaController.actualizarSala);
router.post('/guardarSala', salaController.guardarSala);


module.exports = router;