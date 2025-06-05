import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
    getNotificacoes,
    getNotificacaoById,
    getNotificacoesNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    createNotificacao,
    deleteNotificacao
} from '../controllers/notificacoesController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Notification routes
router.get('/', getNotificacoes);
router.get('/unread', getNotificacoesNaoLidas);
router.get('/:id', getNotificacaoById);
router.post('/', createNotificacao);
router.post('/:id/read', marcarComoLida);
router.post('/read-all', marcarTodasComoLidas);
router.delete('/:id', deleteNotificacao);

export default router; 