const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/', chatController.getMensagens);
router.get('/:id', chatController.getMensagemById);

// Rotas protegidas
router.get('/usuario/:usuarioId', protect, chatController.getMensagensByUsuario);
router.get('/empresa/:empresaId', protect, chatController.getMensagensByEmpresa);
router.get('/vaga/:vagaId', protect, chatController.getMensagensByVaga);
router.get('/conversa/:usuarioId/:empresaId', protect, chatController.getConversation);
router.post('/', protect, chatController.createMensagem);
router.put('/:id', protect, chatController.updateMensagem);
router.delete('/:id', protect, chatController.deleteMensagem);

module.exports = router;