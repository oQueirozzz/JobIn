const Notificacao = require('../models/Notificacao');

class NotificacaoService {
  // Notificação de perfil visitado
  static async criarNotificacaoPerfilVisitado(usuarioId, visitanteId) {
    const visitante = await require('../models/Usuario').findById(visitanteId);
    const mensagem = `${visitante.nome} visitou seu perfil`;
    
    return await Notificacao.create({
      usuarios_id: usuarioId,
      mensagem,
      tipo: 'PERFIL_VISITADO'
    });
  }

  // Notificação de candidatura criada
  static async criarNotificacaoCandidaturaCriada(usuarioId, empresaId, vagaId) {
    const vaga = await require('../models/Vaga').findById(vagaId);
    const mensagem = `Você se candidatou para a vaga "${vaga.titulo}"`;
    
    return await Notificacao.create({
      usuarios_id: usuarioId,
      empresas_id: empresaId,
      candidaturas_id: vagaId,
      mensagem,
      tipo: 'CANDIDATURA_CRIADA'
    });
  }

  // Notificação de candidatura removida
  static async criarNotificacaoCandidaturaRemovida(usuarioId, empresaId, vagaId) {
    const vaga = await require('../models/Vaga').findById(vagaId);
    const mensagem = `Você removeu sua candidatura da vaga "${vaga.titulo}"`;
    
    return await Notificacao.create({
      usuarios_id: usuarioId,
      empresas_id: empresaId,
      candidaturas_id: vagaId,
      mensagem,
      tipo: 'CANDIDATURA_REMOVIDA'
    });
  }

  // Notificação de candidatura aprovada
  static async criarNotificacaoCandidaturaAprovada(usuarioId, empresaId, vagaId) {
    const vaga = await require('../models/Vaga').findById(vagaId);
    const empresa = await require('../models/Empresa').findById(empresaId);
    const mensagem = `Sua candidatura para a vaga "${vaga.titulo}" na empresa ${empresa.nome} foi aprovada!`;
    
    return await Notificacao.create({
      usuarios_id: usuarioId,
      empresas_id: empresaId,
      candidaturas_id: vagaId,
      mensagem,
      tipo: 'CANDIDATURA_APROVADA'
    });
  }

  // Notificação de vaga excluída
  static async criarNotificacaoVagaExcluida(usuarioId, empresaId, vagaId) {
    const vaga = await require('../models/Vaga').findById(vagaId);
    const mensagem = `A vaga "${vaga.titulo}" que você se candidatou foi excluída`;
    
    return await Notificacao.create({
      usuarios_id: usuarioId,
      empresas_id: empresaId,
      candidaturas_id: vagaId,
      mensagem,
      tipo: 'VAGA_EXCLUIDA'
    });
  }

  // Notificação de vaga atualizada
  static async criarNotificacaoVagaAtualizada(usuarioId, empresaId, vagaId) {
    const vaga = await require('../models/Vaga').findById(vagaId);
    const mensagem = `A vaga "${vaga.titulo}" que você se candidatou foi atualizada`;
    
    return await Notificacao.create({
      usuarios_id: usuarioId,
      empresas_id: empresaId,
      candidaturas_id: vagaId,
      mensagem,
      tipo: 'VAGA_ATUALIZADA'
    });
  }

  // Notificação de senha alterada
  static async criarNotificacaoSenhaAlterada(usuarioId) {
    const mensagem = 'Sua senha foi alterada com sucesso';
    
    return await Notificacao.create({
      usuarios_id: usuarioId,
      mensagem,
      tipo: 'SENHA_ALTERADA'
    });
  }

  // Criar notificação de perfil visitado diária
  static async criarNotificacaoPerfilVisitadoDiaria(usuarioId) {
    const visitantes = await require('../models/Usuario').findAll();
    const visitanteAleatorio = visitantes[Math.floor(Math.random() * visitantes.length)];
    
    if (visitanteAleatorio && visitanteAleatorio.id !== usuarioId) {
      return await this.criarNotificacaoPerfilVisitado(usuarioId, visitanteAleatorio.id);
    }
  }
}

module.exports = NotificacaoService; 