import Notificacao from '../models/Notificacao.js';
import Usuario from '../models/Usuario.js';
import Vaga from '../models/Vaga.js';
import Empresa from '../models/Empresa.js';
import * as logsController from '../controllers/logsController.js';

class NotificacaoService {
  // Notificação de perfil visitado
  static async criarNotificacaoPerfilVisitado(usuarioId, visitanteId) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoPerfilVisitado', { usuarioId, visitanteId });
    try {
      const visitante = await Usuario.findById(visitanteId);
      if (!visitante) {
        throw new Error('Visitante não encontrado');
      }
      
      const mensagem = `${visitante.nome} visitou seu perfil`;
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: null,
        candidaturas_id: 0,
        mensagem_usuario: mensagem,
        mensagem_empresa: null,
        status_candidatura: 'PENDENTE',
        tipo: 'PERFIL_VISITADO',
        lida: false
      });
    } catch (error) {
      console.error('Erro ao criar notificação de perfil visitado:', error);
      throw error;
    }
  }

  // Notificação de perfil visitado por empresa
  static async criarNotificacaoPerfilVisitadoPorEmpresa(usuarioId, empresaId) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoPerfilVisitadoPorEmpresa', { usuarioId, empresaId });
    try {
      const empresa = await Empresa.findById(empresaId);
      if (!empresa) {
        throw new Error('Empresa não encontrada');
      }
      
      const mensagem = `${empresa.nome} visitou seu perfil`;
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: null, // A notificação é para o usuário, não para a empresa
        candidaturas_id: null,
        mensagem_usuario: mensagem,
        mensagem_empresa: null,
        status_candidatura: null,
        tipo: 'PERFIL_VISITADO',
        lida: false
      });
    } catch (error) {
      console.error('Erro ao criar notificação de perfil visitado por empresa:', error);
      throw error;
    }
  }

  // Notificação de candidatura criada
  static async criarNotificacaoCandidaturaCriada(usuarioId, empresaId, vagaId, candidaturaId) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoCandidaturaCriada', { usuarioId, empresaId, vagaId, candidaturaId });
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
        candidaturas_id: candidaturaId,
        mensagem_usuario: `Você se candidatou para a vaga "${vaga.nome_vaga}"`,
        mensagem_empresa: `${usuario.nome} se candidatou para a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'PENDENTE',
        tipo: 'CANDIDATURA_CRIADA',
        lida: false
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidatura:', error);
      throw error;
    }
  }

  // Notificação de candidatura removida
  static async criarNotificacaoCandidaturaRemovida(usuarioId, empresaId, vagaId, candidaturaId) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoCandidaturaRemovida', { usuarioId, empresaId, vagaId, candidaturaId });
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
        candidaturas_id: candidaturaId,
        mensagem_usuario: `Você removeu sua candidatura da vaga "${vaga.nome_vaga}"`,
        mensagem_empresa: `${usuario.nome} removeu a candidatura da vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'PENDENTE',
        tipo: 'CANDIDATURA_REMOVIDA',
        lida: false
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidatura removida:', error);
      throw error;
    }
  }

  // Notificação de candidatura aprovada
  static async criarNotificacaoCandidaturaAprovada(usuarioId, empresaId, vagaId, candidaturaId) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoCandidaturaAprovada', { usuarioId, empresaId, vagaId, candidaturaId });
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
        candidaturas_id: candidaturaId,
        mensagem_usuario: `Sua candidatura para a vaga "${vaga.nome_vaga}" na empresa ${empresa.nome} foi aprovada!`,
        mensagem_empresa: `Você aprovou a candidatura de um usuário para a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'APROVADO',
        tipo: 'CANDIDATURA_APROVADA',
        lida: false
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidatura aprovada:', error);
      throw error;
    }
  }

  // Notificação de vaga atualizada
  static async criarNotificacaoVagaAtualizada(usuarioId, empresaId, vagaId, candidaturaId = null) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoVagaAtualizada', { usuarioId, empresaId, vagaId, candidaturaId });
    try {
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: empresaId,
        candidaturas_id: candidaturaId,
        mensagem_usuario: `A vaga "${vaga.nome_vaga}" que você se candidatou foi atualizada`,
        mensagem_empresa: `Você atualizou a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'PENDENTE',
        tipo: 'VAGA_ATUALIZADA',
        lida: false
      });
    } catch (error) {
      console.error('Erro ao criar notificação de vaga atualizada:', error);
      throw error;
    }
  }

  // Notificação de vaga excluída
  static async criarNotificacaoVagaExcluida(usuarioId, empresaId, vagaId, candidaturaId = null) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoVagaExcluida', { usuarioId, empresaId, vagaId, candidaturaId });
    try {
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }
      
      return await Notificacao.create({
        usuarios_id: usuarioId,
        empresas_id: empresaId,
        candidaturas_id: candidaturaId,
        mensagem_usuario: `A vaga "${vaga.nome_vaga}" que você se candidatou foi excluída`,
        mensagem_empresa: `Você excluiu a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'PENDENTE',
        tipo: 'VAGA_EXCLUIDA',
        lida: false
      });
    } catch (error) {
      console.error('Erro ao criar notificação de vaga excluída:', error);
      throw error;
    }
  }

  // Notificação de conta criada
  static async criarNotificacaoContaCriada(usuarioId, empresaId, isEmpresa) {
    try {
      console.log('[NotificacaoService] Disparando: criarNotificacaoContaCriada', { usuarioId, empresaId, isEmpresa });
      
      const mensagem = isEmpresa 
        ? 'Bem-vindo(a) ao JobIn! Sua empresa foi registrada com sucesso.'
        : 'Bem-vindo(a) ao JobIn! Sua conta foi criada com sucesso.';

      const dados = {
        usuarios_id: isEmpresa ? null : usuarioId,
        empresas_id: isEmpresa ? empresaId : null,
        candidaturas_id: null,
        mensagem_usuario: isEmpresa ? null : mensagem,
        mensagem_empresa: isEmpresa ? mensagem : null,
        status_candidatura: null,
        tipo: 'CONTA_CRIADA',
        lida: false
      };

      console.log('Criando notificação com dados:', dados);
      const notificacao = await Notificacao.create(dados);
      console.log('Notificação criada com sucesso:', notificacao);
      return notificacao;
    } catch (error) {
      console.error('Erro ao criar notificação de conta criada:', error);
      throw error;
    }
  }

  // Notificação de senha alterada
  static async criarNotificacaoSenhaAlterada(usuarioId, empresaId, isEmpresa = false) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoSenhaAlterada', { usuarioId, empresaId, isEmpresa });
    try {
      if (isEmpresa) {
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
          throw new Error('Empresa não encontrada');
        }

        return await Notificacao.create({
          usuarios_id: null,
          empresas_id: empresaId,
          candidaturas_id: null,
          mensagem_usuario: null,
          mensagem_empresa: 'Sua senha foi alterada com sucesso. Se você não fez essa alteração, entre em contato com o suporte.',
          status_candidatura: null,
          tipo: 'SENHA_ALTERADA',
          lida: false
        });
      } else {
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }

        return await Notificacao.create({
          usuarios_id: usuarioId,
          empresas_id: null,
          candidaturas_id: null,
          mensagem_usuario: 'Sua senha foi alterada com sucesso. Se você não fez essa alteração, entre em contato com o suporte.',
          mensagem_empresa: null,
          status_candidatura: null,
          tipo: 'SENHA_ALTERADA',
          lida: false
        });
      }
    } catch (error) {
      console.error('Erro ao criar notificação de senha alterada:', error);
      throw error;
    }
  }

  // Notificação de vaga criada
  static async criarNotificacaoVagaCriada(empresaId, vagaId) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoVagaCriada', { empresaId, vagaId });
    try {
      // Buscar a vaga para obter o nome
      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      // Criar notificação para a empresa
      await Notificacao.create({
        empresas_id: empresaId,
        usuarios_id: null,
        mensagem_usuario: null,
        mensagem_empresa: `Nova vaga "${vaga.nome_vaga}" criada com sucesso!`,
        status_candidatura: 'PENDENTE',
        tipo: 'VAGA_CRIADA',
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
  static async criarNotificacaoCandidaturaRejeitada(usuarioId, empresaId, vagaId, candidaturaId) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoCandidaturaRejeitada', { usuarioId, empresaId, vagaId, candidaturaId });
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
        candidaturas_id: candidaturaId,
        mensagem_usuario: `Sua candidatura para a vaga "${vaga.nome_vaga}" foi rejeitada`,
        mensagem_empresa: `Você rejeitou a candidatura de ${usuario.nome} para a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'REJEITADO',
        tipo: 'CANDIDATURA_REJEITADA',
        lida: false
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidatura rejeitada:', error);
      throw error;
    }
  }

  // Notificação de candidatura em espera
  static async criarNotificacaoCandidaturaEmEspera(usuarioId, empresaId, vagaId, candidaturaId) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoCandidaturaEmEspera', { usuarioId, empresaId, vagaId, candidaturaId });
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
        candidaturas_id: candidaturaId,
        mensagem_usuario: `Sua candidatura para a vaga "${vaga.nome_vaga}" está em análise`,
        mensagem_empresa: `Você colocou a candidatura de ${usuario.nome} em análise para a vaga "${vaga.nome_vaga}"`,
        status_candidatura: 'EM_ESPERA',
        tipo: 'CANDIDATURA_EM_ESPERA',
        lida: false
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

  // Notificação de perfil atualizado
  static async criarNotificacaoPerfilAtualizado(usuarioId, empresaId, isEmpresa = false) {
    console.log('[NotificacaoService] Disparando: criarNotificacaoPerfilAtualizado', { usuarioId, empresaId, isEmpresa });
    try {
      if (isEmpresa) {
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
          throw new Error('Empresa não encontrada');
        }

        return await Notificacao.create({
          usuarios_id: null,
          empresas_id: empresaId,
          candidaturas_id: null,
          mensagem_usuario: null,
          mensagem_empresa: 'Seu perfil foi atualizado com sucesso.',
          status_candidatura: null,
          tipo: 'PERFIL_ATUALIZADO',
          lida: false
        });
      } else {
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }

        return await Notificacao.create({
          usuarios_id: usuarioId,
          empresas_id: null,
          candidaturas_id: null,
          mensagem_usuario: 'Seu perfil foi atualizado com sucesso.',
          mensagem_empresa: null,
          status_candidatura: null,
          tipo: 'PERFIL_ATUALIZADO',
          lida: false
        });
      }
    } catch (error) {
      console.error('Erro ao criar notificação de perfil atualizado:', error);
      throw error;
    }
  }
}

export default NotificacaoService; 