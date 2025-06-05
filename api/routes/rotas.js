import express from 'express';
import * as rotasController from '../controllers/rotasController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/', rotasController.getRotas);
router.get('/active', rotasController.getActiveRotas);
router.get('/:id', rotasController.getRotaById);
router.get('/creator/:createdBy', rotasController.getRotasByCreator);
router.get('/difficulty/:difficulty', rotasController.getRotasByDifficulty);
router.get('/usuario/:usuarioId', rotasController.getRotasByUsuario);
router.get('/empresa/:empresaId', rotasController.getRotasByEmpresa);

// Rotas protegidas
router.post('/', protect, rotasController.createRota);
router.put('/:id', protect, rotasController.updateRota);
router.delete('/:id', protect, rotasController.deleteRota);
router.patch('/:id/toggle-active', protect, rotasController.toggleActiveRota);

export default router;