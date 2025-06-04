const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController.js');

// Rotas públicas
router.get('/', chatController.getMensagens);
router.get('/:id', chatController.getMensagemById);

// Todas as rotas são públicas
router.get('/usuario/:usuarioId', chatController.getMensagensByUsuario);
router.get('/empresa/:empresaId', chatController.getMensagensByEmpresa);
router.get('/vaga/:vagaId', chatController.getMensagensByVaga);
router.get('/conversa/:usuarioId/:empresaId', chatController.getConversation);
router.post('/', chatController.createMensagem);
router.put('/:id', chatController.updateMensagem);
router.delete('/:id', chatController.deleteMensagem);

module.exports = router;