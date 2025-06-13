import express from 'express';
import * as vagasController from '../controllers/vagasController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/', vagasController.getVagas);
router.get('/:id', vagasController.getVagaById);
router.get('/empresa/:empresaId', vagasController.getVagasByEmpresa);

// Rotas protegidas
router.post('/', protect, vagasController.createVaga);
router.put('/:id', protect, vagasController.updateVaga);
router.delete('/:id', protect, vagasController.deleteVaga);

export default router;