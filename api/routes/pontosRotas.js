const express = require('express');
const router = express.Router();
const pontosRotasController = require('../controllers/pontosRotasController');
const { protect } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/', pontosRotasController.getPontosRotas);
router.get('/:id', pontosRotasController.getPontoRotaById);
router.get('/rota/:routeId', pontosRotasController.getPontosByRouteId);

// Rotas protegidas
router.post('/', protect, pontosRotasController.createPontoRota);
router.post('/many', protect, pontosRotasController.createManyPontosRota);
router.put('/:id', protect, pontosRotasController.updatePontoRota);
router.delete('/:id', protect, pontosRotasController.deletePontoRota);
router.delete('/rota/:routeId', protect, pontosRotasController.deletePontosByRouteId);

module.exports = router;