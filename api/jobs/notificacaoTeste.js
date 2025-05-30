const cron = require('node-cron');
const Notificacao = require('../models/Notificacao');

// Função para gerar uma notificação de teste
async function gerarNotificacaoTeste() {
  try {
    console.log('Tentando criar notificação de teste...');

    // Cria uma notificação simples
    const notificacao = await Notificacao.create({
      usuarios_id: 4,
      candidaturas_id: 1, // ID de uma candidatura existente
      empresas_id: 1, // ID de uma empresa existente
      mensagem_usuario: 'Teste de notificação para o usuário',
      mensagem_empresa: 'Teste de notificação para a empresa',
      status_candidatura: 'PENDENTE'
    });

    console.log('Notificação criada:', notificacao);
  } catch (error) {
    console.error('Erro ao criar notificação:', error.message);
  }
}

// Agenda o job para rodar a cada 10 segundos
cron.schedule('*/10 * * * * *', () => {
  console.log('Executando job de teste...');
  gerarNotificacaoTeste();
});

console.log('Job de teste iniciado!'); 