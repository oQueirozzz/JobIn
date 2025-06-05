import Notificacao from '../models/Notificacao.js';
import Log from '../models/Log.js';

// Obter todas as notificações
export const getNotificacoes = async (req, res) => {
  try {
    const userId = req.usuario.id;
    const notificacoes = await Notificacao.findByUsuario(userId);
    res.json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações' });
  }
};

// Obter notificação por ID
export const getNotificacaoById = async (req, res) => {
  try {
    const notificacao = await Notificacao.findById(req.params.id);
    if (!notificacao) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }
    res.json(notificacao);
  } catch (error) {
    console.error('Erro ao buscar notificação:', error);
    res.status(500).json({ message: 'Erro ao buscar notificação' });
  }
};

// Obter notificações por usuário
export const getNotificacoesByUsuario = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findByUsuario(req.params.usuarioId);
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações do usuário' });
  }
};

// Obter notificações não lidas por usuário
export const getNotificacoesNaoLidas = async (req, res) => {
  try {
    const userId = req.usuario.id;
    const notificacoes = await Notificacao.getNotificacoesNaoLidas(userId);
    res.json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações não lidas:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações não lidas' });
  }
};

// Obter notificações por empresa
export const getNotificacoesByEmpresa = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findByEmpresa(req.params.empresaId);
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações da empresa:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações da empresa' });
  }
};

// Obter notificações por candidatura
export const getNotificacoesByCandidatura = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findByCandidatura(req.params.candidaturaId);
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações da candidatura:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações da candidatura' });
  }
};

// Criar nova notificação
export const createNotificacao = async (req, res) => {
  try {
    const { candidaturas_id, empresas_id, usuarios_id, mensagem_usuario, mensagem_empresa, tipo, status_candidatura } = req.body;
    
    // Validação básica
    if (!usuarios_id || !empresas_id || !candidaturas_id || !mensagem_usuario || !mensagem_empresa || !tipo) {
      return res.status(400).json({ message: 'Dados incompletos para criar notificação' });
    }
    
    const notificacao = await Notificacao.create({
      candidaturas_id,
      empresas_id,
      usuarios_id,
      mensagem_usuario,
      mensagem_empresa,
      tipo,
      status_candidatura
    });
    
    // Registrar log da criação da notificação
    await Log.create({
      usuario_id: usuarios_id,
      empresa_id: empresas_id,
      acao: 'CRIAR',
      resourse: 'NOTIFICACAO',
      descricao: 'Notificação criada',
      detalhes: { notificacao_id: notificacao.id, tipo }
    });
    
    res.status(201).json(notificacao);
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    res.status(500).json({ message: 'Erro ao criar notificação' });
  }
};

// Marcar notificação como lida
export const marcarComoLida = async (req, res) => {
  try {
    const notificacao = await Notificacao.marcarComoLida(req.params.id);
    if (!notificacao) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }
    res.json(notificacao);
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ message: 'Erro ao marcar notificação como lida' });
  }
};

// Marcar todas as notificações do usuário como lidas
export const marcarTodasComoLidas = async (req, res) => {
  try {
    const userId = req.usuario.id;
    const count = await Notificacao.marcarTodasComoLidas(userId);
    res.json({ message: `${count} notificações marcadas como lidas` });
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error);
    res.status(500).json({ message: 'Erro ao marcar todas as notificações como lidas' });
  }
};

// Excluir notificação
export const deleteNotificacao = async (req, res) => {
  try {
    const notificacao = await Notificacao.findById(req.params.id);
    
    if (!notificacao) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    await Notificacao.delete(req.params.id);
    
    // Registrar log da exclusão da notificação
    await Log.create({
      usuario_id: notificacao.usuarios_id,
      empresa_id: notificacao.empresas_id,
      tipo_acao: 'EXCLUIR',
      tipo_entidade: 'NOTIFICACAO',
      descricao: 'Notificação excluída',
      dados_adicionais: { notificacao_id: notificacao.id, tipo: notificacao.tipo }
    });
    
    res.status(200).json({ message: 'Notificação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir notificação:', error);
    res.status(500).json({ message: 'Erro ao excluir notificação' });
  }
};