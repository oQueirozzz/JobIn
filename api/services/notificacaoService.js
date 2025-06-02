const Notificacao = require('../models/Notificacao');
const Usuario = require('../models/Usuario');
const Vaga = require('../models/Vaga');
const Empresa = require('../models/Empresa');
const logsController = require('../controllers/logsController');

class NotificacaoService {
  // Notificação de perfil visitado
  static async criarNotificacaoPerfilVisitado(usuarioId, visitanteId) {
    try {
      const visitante = await Usuario.findById(visitanteId);
      if (!visitante) {
        throw new Error('Visitante não encontrado');
      }
      
      const mensagem = `${visitante.nome} visitou seu perfil`;
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: 0,
        candidaturas_id: 0,
        mensagem_usuario: mensagem,
        mensagem_empresa: null,
        status_candidatura: 'PENDENTE'
      });
    } catch (error) {
      console.error('Erro ao criar notificação de perfil visitado:', error);
      throw error;
    }
  }

  // Notificação de candidatura criada
  static async criarNotificacaoCandidaturaCriada(usuarioId, empresaId, vagaId) {
    try {
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      const usuario = await Usuario.findById(usuarioId);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: empresaId,
        candidaturas_id: vagaId,
        mensagem_usuario: `Você se candidatou para a vaga "${vaga.nome_vaga}"`,
        mensagem_empresa: `${usuario.nome} se candidatou para a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'PENDENTE'
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidatura:', error);
      throw error;
    }
  }

  // Notificação de candidatura removida
  static async criarNotificacaoCandidaturaRemovida(usuarioId, empresaId, vagaId) {
    try {
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      const usuario = await Usuario.findById(usuarioId);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: empresaId,
        candidaturas_id: vagaId,
        mensagem_usuario: `Você removeu sua candidatura da vaga "${vaga.nome_vaga}"`,
        mensagem_empresa: `${usuario.nome} removeu a candidatura da vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'PENDENTE'
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidatura removida:', error);
      throw error;
    }
  }

  // Notificação de candidatura aprovada
  static async criarNotificacaoCandidaturaAprovada(usuarioId, empresaId, vagaId) {
    try {
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      const empresa = await Empresa.findById(empresaId);
      if (!empresa) {
        throw new Error('Empresa não encontrada');
      }
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: empresaId,
        candidaturas_id: vagaId,
        mensagem_usuario: `Sua candidatura para a vaga "${vaga.nome_vaga}" na empresa ${empresa.nome} foi aprovada!`,
        mensagem_empresa: `Você aprovou a candidatura de um usuário para a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'APROVADO'
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidatura aprovada:', error);
      throw error;
    }
  }

  // Notificação de vaga excluída
  static async criarNotificacaoVagaExcluida(usuarioId, empresaId, vagaId) {
    try {
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: empresaId,
        candidaturas_id: vagaId,
        mensagem_usuario: `A vaga "${vaga.nome_vaga}" que você se candidatou foi excluída`,
        mensagem_empresa: `Você excluiu a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'PENDENTE'
      });
    } catch (error) {
      console.error('Erro ao criar notificação de vaga excluída:', error);
      throw error;
    }
  }

  // Notificação de vaga atualizada
  static async criarNotificacaoVagaAtualizada(usuarioId, empresaId, vagaId) {
    try {
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: empresaId,
        candidaturas_id: vagaId,
        mensagem_usuario: `A vaga "${vaga.nome_vaga}" que você se candidatou foi atualizada`,
        mensagem_empresa: `Você atualizou a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'PENDENTE'
      });
    } catch (error) {
      console.error('Erro ao criar notificação de vaga atualizada:', error);
      throw error;
    }
  }

  // Notificação de senha alterada
  static async criarNotificacaoSenhaAlterada(usuarioId, empresaId, isEmpresa = false) {
    try {
      if (isEmpresa) {
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
          throw new Error('Empresa não encontrada');
        }

        return await Notificacao.create({
          usuarios_id: 0,
          empresas_id: empresaId,
          candidaturas_id: 0,
          mensagem_usuario: null,
          mensagem_empresa: 'Sua senha foi alterada com sucesso',
          status_candidatura: 'PENDENTE'
        });
      } else {
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }

        return await Notificacao.create({
          usuarios_id: usuarioId,
          empresas_id: 0,
          candidaturas_id: 0,
          mensagem_usuario: 'Sua senha foi alterada com sucesso',
          mensagem_empresa: null,
          status_candidatura: 'PENDENTE'
        });
      }
    } catch (error) {
      console.error('Erro ao criar notificação de senha alterada:', error);
      throw error;
    }
  }

  // Notificação de vaga criada
  static async criarNotificacaoVagaCriada(empresaId, vagaId) {
    try {
      // Buscar a vaga para obter o nome
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      // Criar notificação para a empresa
      await Notificacao.create({
        candidaturas_id: 0,
        empresas_id: empresaId,
        usuarios_id: 0, // Usando 0 como ID padrão para notificações do sistema
        mensagem_usuario: null,
        mensagem_empresa: `Nova vaga "${vaga.nome_vaga}" criada com sucesso!`,
        status_candidatura: 'PENDENTE',
        lida: false
      });

      // Registrar log
      await logsController.registrarLog(
        0, // Sem usuário
        empresaId,
        'CRIAR',
        'VAGA',
        `Vaga "${vaga.nome_vaga}" criada`,
        { vaga_id: vagaId }
      );
    } catch (error) {
      console.error('Erro ao criar notificação de vaga criada:', error);
      throw error;
    }
  }

  // Notificação de candidatura rejeitada
  static async criarNotificacaoCandidaturaRejeitada(usuarioId, empresaId, vagaId) {
    try {
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      const usuario = await Usuario.findById(usuarioId);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: empresaId,
        candidaturas_id: vagaId,
        mensagem_usuario: `Sua candidatura para a vaga "${vaga.nome_vaga}" foi rejeitada`,
        mensagem_empresa: `Você rejeitou a candidatura de ${usuario.nome} para a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'REJEITADO'
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidatura rejeitada:', error);
      throw error;
    }
  }

  // Notificação de candidatura em espera
  static async criarNotificacaoCandidaturaEmEspera(usuarioId, empresaId, vagaId) {
    try {
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      const usuario = await Usuario.findById(usuarioId);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: empresaId,
        candidaturas_id: vagaId,
        mensagem_usuario: `Sua candidatura para a vaga "${vaga.nome_vaga}" está em análise`,
        mensagem_empresa: `Você colocou a candidatura de ${usuario.nome} em análise para a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'EM_ESPERA'
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidatura em espera:', error);
      throw error;
    }
  }

  // Criar notificação de perfil visitado diária
  static async criarNotificacaoPerfilVisitadoDiaria(usuarioId) {
    const visitantes = await Usuario.findAll();
    const visitanteAleatorio = visitantes[Math.floor(Math.random() * visitantes.length)];
    
    if (visitanteAleatorio && visitanteAleatorio.id !== usuarioId) {
      return await this.criarNotificacaoPerfilVisitado(usuarioId, visitanteAleatorio.id);
    }
  }
}

module.exports = NotificacaoService; 