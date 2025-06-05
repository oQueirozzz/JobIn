import express from 'express';
const router = express.Router();
import empresasController from '../controllers/empresasController.js';

// Rotas públicas
router.post('/register', empresasController.registerEmpresa);
router.post('/login', empresasController.loginEmpresa);
router.get('/', empresasController.getEmpresas);
router.get('/:id', empresasController.getEmpresaById);

// Todas as rotas são públicas
router.put('/:id', empresasController.updateEmpresa);
router.delete('/:id', empresasController.deleteEmpresa);

export default router;