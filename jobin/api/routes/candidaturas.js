const express = require('express');
const router = express.Router();
const candidaturasController = require('../controllers/candidaturasController');
const { protect } = require('../middleware/authMiddleware');

// Rotas protegidas
router.get('/', protect, candidaturasController.getCandidaturas);
router.get('/:id', protect, candidaturasController.getCandidaturaById);
router.get('/usuario/:usuarioId', protect, candidaturasController.getCandidaturasByUsuario);
router.get('/vaga/:vagaId', protect, candidaturasController.getCandidaturasByVaga);
router.post('/', protect, candidaturasController.createCandidatura);
router.put('/:id', protect, candidaturasController.updateCandidatura);
router.delete('/:id', protect, candidaturasController.deleteCandidatura);

module.exports = router;