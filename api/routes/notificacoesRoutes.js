import express from 'express';
import { protect, empresa, usuario  } from '../middleware/authMiddleware.js';
import {
    getNotificacoes,
    getNotificacaoById,
    getNotificacoesNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    createNotificacao,
    deleteNotificacao,
    criarNotificacaoPerfilVisitado
} from '../controllers/notificacoesController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Notification routes
router.get('/', getNotificacoes);
router.get('/unread', getNotificacoesNaoLidas);
router.get('/:id', getNotificacaoById);
router.post('/', createNotificacao);
router.post('/:id/read', marcarComoLida);
router.post('/read-all', marcarTodasComoLidas);
router.delete('/:id', deleteNotificacao);

// Criar notificação de perfil visitado
router.post('/perfil-visitado', verificarToken, criarNotificacaoPerfilVisitado);

export default router; 