import express from 'express';
import * as notificacoesController from '../controllers/notificacoesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/', notificacoesController.getNotificacoes);
router.get('/:id', notificacoesController.getNotificacaoById);
router.get('/usuario/:usuarioId', notificacoesController.getNotificacoesByUsuario);
router.get('/empresa/:empresaId', notificacoesController.getNotificacoesByEmpresa);
router.post('/', notificacoesController.createNotificacao);
router.delete('/:id', notificacoesController.deleteNotificacao);

// Rotas protegidas
router.get('/usuario/:usuarioId/nao-lidas', protect, notificacoesController.getNotificacoesNaoLidasByUsuario);
router.get('/candidatura/:candidaturaId', protect, notificacoesController.getNotificacoesByCandidatura);
router.put('/:id/marcar-lida', protect, notificacoesController.marcarComoLida);
router.put('/usuario/:usuarioId/marcar-todas-lidas', protect, notificacoesController.marcarTodasComoLidas);

export default router;