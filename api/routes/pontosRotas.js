import express from 'express';
import * as pontosRotasController from '../controllers/pontosRotasController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/', pontosRotasController.getPontosRotas);
router.get('/:id', pontosRotasController.getPontoRotaById);
router.get('/rota/:rotaId', pontosRotasController.getPontosRotasByRota);

// Rotas protegidas
router.post('/', protect, pontosRotasController.createPontoRota);
router.post('/many', protect, pontosRotasController.createManyPontosRota);
router.put('/:id', protect, pontosRotasController.updatePontoRota);
router.delete('/:id', protect, pontosRotasController.deletePontoRota);
router.delete('/rota/:routeId', protect, pontosRotasController.deletePontosByRouteId);

export default router;