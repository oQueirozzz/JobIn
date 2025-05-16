const express = require('express');
const router = express.Router();
const vagasController = require('../controllers/vagasController');
const { protect } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/', vagasController.getVagas);
router.get('/:id', vagasController.getVagaById);
router.get('/empresa/:empresaId', vagasController.getVagasByEmpresa);

// Rotas protegidas
router.post('/', protect, vagasController.createVaga);
router.put('/:id', protect, vagasController.updateVaga);
router.delete('/:id', protect, vagasController.deleteVaga);

module.exports = router;