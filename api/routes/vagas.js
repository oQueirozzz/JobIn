const express = require('express');
const router = express.Router();
const vagasController = require('../controllers/vagasController.js');

// Rotas públicas
router.get('/', vagasController.getVagas);
router.get('/:id', vagasController.getVagaById);
router.get('/empresa/:empresaId', vagasController.getVagasByEmpresa);


// Todas as rotas 
router.post('/', vagasController.createVaga);
router.put('/:id', vagasController.updateVaga);
router.delete('/:id', vagasController.deleteVaga);


module.exports = router;