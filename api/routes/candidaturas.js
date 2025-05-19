const express = require('express');
const router = express.Router();
const candidaturasController = require('../controllers/candidaturasController');
const { protect } = require('../middleware/authMiddleware');

// Todas as rotas são públicas
router.get('/', candidaturasController.getCandidaturas);
router.get('/:id', candidaturasController.getCandidaturaById);
router.get('/usuario/:usuarioId', candidaturasController.getCandidaturasByUsuario);
router.get('/vaga/:vagaId', candidaturasController.getCandidaturasByVaga);
router.post('/', candidaturasController.createCandidatura);
router.put('/:id', candidaturasController.updateCandidatura);
router.delete('/:id', candidaturasController.deleteCandidatura);

module.exports = router;