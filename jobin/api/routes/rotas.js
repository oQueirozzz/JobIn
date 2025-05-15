const express = require('express');
const router = express.Router();
const rotasController = require('../controllers/rotasController');
const { protect } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/', rotasController.getRotas);
router.get('/active', rotasController.getActiveRotas);
router.get('/:id', rotasController.getRotaById);
router.get('/creator/:createdBy', rotasController.getRotasByCreator);
router.get('/difficulty/:difficulty', rotasController.getRotasByDifficulty);

// Rotas protegidas
router.post('/', protect, rotasController.createRota);
router.put('/:id', protect, rotasController.updateRota);
router.delete('/:id', protect, rotasController.deleteRota);
router.patch('/:id/toggle-active', protect, rotasController.toggleActiveRota);

module.exports = router;