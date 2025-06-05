import express from 'express';
const router = express.Router();
import logsController from '../controllers/logsController.js';
import { protect } from '../middleware/authMiddleware.js';

// Rotas protegidas
router.get('/', protect, logsController.getLogs);
router.get('/:id', protect, logsController.getLogById);
router.get('/usuario/:usuarioId', protect, logsController.getLogsByUsuario);
router.get('/empresa/:empresaId', protect, logsController.getLogsByEmpresa);
router.get('/acao/:acao', protect, logsController.getLogsByAcao);
router.post('/', protect, logsController.createLog);
router.put('/:id', protect, logsController.updateLog);
router.delete('/:id', protect, logsController.deleteLog);

export default router;