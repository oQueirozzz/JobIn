const express = require('express');
const router = express.Router();
const notificacoesController = require('../controllers/notificacoesController');
const { protect } = require('../middleware/authMiddleware');

// Rotas protegidas
router.get('/', protect, notificacoesController.getNotificacoes);
router.get('/:id', protect, notificacoesController.getNotificacaoById);
router.get('/usuario/:usuarioId', protect, notificacoesController.getNotificacoesByUsuario);
router.get('/empresa/:empresaId', protect, notificacoesController.getNotificacoesByEmpresa);
router.get('/candidatura/:candidaturaId', protect, notificacoesController.getNotificacoesByCandidatura);
router.post('/', protect, notificacoesController.createNotificacao);
router.put('/:id', protect, notificacoesController.updateNotificacao);
router.delete('/:id', protect, notificacoesController.deleteNotificacao);

module.exports = router;