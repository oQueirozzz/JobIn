import express from 'express';
import * as candidaturasController from '../controllers/candidaturasController.js';

const router = express.Router();

// Todas as rotas são públicas
router.get('/', candidaturasController.getCandidaturas);
router.get('/:id', candidaturasController.getCandidaturaById);
router.get('/usuario/:usuarioId', candidaturasController.getCandidaturasByUsuario);
router.get('/vaga/:vagaId', candidaturasController.getCandidaturasByVaga);
router.post('/', candidaturasController.createCandidatura);
router.put('/:id/status', candidaturasController.updateStatusCandidatura);
router.delete('/:id', candidaturasController.deleteCandidatura);

export default router;