const cron = require('node-cron');
const Usuario = require('../models/Usuario');
const NotificacaoService = require('../services/notificacaoService');

// Executar todos os dias à meia-noite
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Iniciando job de notificações diárias...');
    
    // Buscar todos os usuários
    const usuarios = await Usuario.findAll();
    
    // Criar notificação para cada usuário
    for (const usuario of usuarios) {
      await NotificacaoService.criarNotificacaoPerfilVisitadoDiaria(usuario.id);
    }
    
    console.log('Job de notificações diárias concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao executar job de notificações diárias:', error);
  }
}); 