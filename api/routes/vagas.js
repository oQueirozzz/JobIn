import express from 'express';
import * as vagasController from '../controllers/vagasController.js';

const router = express.Router();

// Rotas públicas
router.get('/', vagasController.getVagas);
router.get('/:id', vagasController.getVagaById);
router.get('/empresa/:empresaId', vagasController.getVagasByEmpresa);

// Todas as rotas 
router.post('/', vagasController.createVaga);
router.put('/:id', vagasController.updateVaga);
router.delete('/:id', vagasController.deleteVaga);

export default router;