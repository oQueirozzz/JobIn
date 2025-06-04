const express = require('express');
const router = express.Router();
const notificacoesController = require('../controllers/notificacoesController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Rotas protegidas
router.get('/', protect, notificacoesController.getNotificacoes);
router.get('/:id', protect, notificacoesController.getNotificacaoById);
router.get('/usuario/:usuarioId', protect, notificacoesController.getNotificacoesByUsuario);
router.get('/usuario/:usuarioId/nao-lidas', protect, notificacoesController.getNotificacoesNaoLidasByUsuario);
router.get('/empresa/:empresaId', protect, notificacoesController.getNotificacoesByEmpresa);
router.get('/candidatura/:candidaturaId', protect, notificacoesController.getNotificacoesByCandidatura);
router.post('/', protect, notificacoesController.createNotificacao);
router.put('/:id/marcar-lida', protect, notificacoesController.marcarComoLida);
router.put('/usuario/:usuarioId/marcar-todas-lidas', protect, notificacoesController.marcarTodasComoLidas);
router.delete('/:id', protect, notificacoesController.deleteNotificacao);

module.exports = router;