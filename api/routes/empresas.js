import express from 'express';
import { registerEmpresa, loginEmpresa, getEmpresaById, updateEmpresa, deleteEmpresa } from '../controllers/empresasController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Rotas públicas
router.post('/register', registerEmpresa);
router.post('/login', loginEmpresa);

// Rotas protegidas
router.use(protect);
router.get('/:id', getEmpresaById);
router.put('/:id', upload.single('logo'), updateEmpresa);
router.delete('/:id', deleteEmpresa);

export default router;