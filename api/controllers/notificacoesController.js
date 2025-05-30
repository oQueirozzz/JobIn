const Notificacao = require('../models/Notificacao');
const Log = require('../models/Log');

// Obter todas as notificações
exports.getNotificacoes = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findAll();
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações' });
  }
};

// Obter notificação por ID
exports.getNotificacaoById = async (req, res) => {
  try {
    const notificacao = await Notificacao.findById(req.params.id);
    if (!notificacao) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }
    res.status(200).json(notificacao);
  } catch (error) {
    console.error('Erro ao buscar notificação:', error);
    res.status(500).json({ message: 'Erro ao buscar notificação' });
  }
};

// Obter notificações por usuário
exports.getNotificacoesByUsuario = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findByUsuario(req.params.usuarioId);
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações do usuário' });
  }
};

// Obter notificações não lidas por usuário
exports.getNotificacoesNaoLidasByUsuario = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findNaoLidasByUsuario(req.params.usuarioId);
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações não lidas:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações não lidas' });
  }
};

// Obter notificações por empresa
exports.getNotificacoesByEmpresa = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findByEmpresa(req.params.empresaId);
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações da empresa:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações da empresa' });
  }
};

// Obter notificações por candidatura
exports.getNotificacoesByCandidatura = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findByCandidatura(req.params.candidaturaId);
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações da candidatura:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações da candidatura' });
  }
};

// Criar nova notificação
exports.createNotificacao = async (req, res) => {
  try {
    const { candidaturas_id, empresas_id, usuarios_id, mensagem, tipo } = req.body;
    
    // Validação básica
    if (!usuarios_id || !mensagem || !tipo) {
      return res.status(400).json({ message: 'Dados incompletos para criar notificação' });
    }
    
    const notificacao = await Notificacao.create({
      candidaturas_id,
      empresas_id,
      usuarios_id,
      mensagem,
      tipo
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
exports.marcarComoLida = async (req, res) => {
  try {
    const notificacaoId = req.params.id;
    const sucesso = await Notificacao.marcarComoLida(notificacaoId);
    
    if (!sucesso) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }
    
    res.status(200).json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ message: 'Erro ao marcar notificação como lida' });
  }
};

// Marcar todas as notificações do usuário como lidas
exports.marcarTodasComoLidas = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const quantidade = await Notificacao.marcarTodasComoLidas(usuarioId);
    
    res.status(200).json({ 
      message: 'Notificações marcadas como lidas',
      quantidade
    });
  } catch (error) {
    console.error('Erro ao marcar notificações como lidas:', error);
    res.status(500).json({ message: 'Erro ao marcar notificações como lidas' });
  }
};

// Excluir notificação
exports.deleteNotificacao = async (req, res) => {
  try {
    const notificacaoId = req.params.id;
    
    const notificacaoExistente = await Notificacao.findById(notificacaoId);
    if (!notificacaoExistente) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }
    
    const { usuarios_id, empresas_id } = notificacaoExistente;
    
    const resultado = await Notificacao.delete(notificacaoId);
    
    if (!resultado || resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Falha ao excluir notificação' });
    }
    
    await Log.create({
      usuario_id: usuarios_id,
      empresa_id: empresas_id,
      acao: 'EXCLUIR',
      resourse: 'NOTIFICACAO',
      descricao: 'Notificação excluída',
      detalhes: { notificacao_id: notificacaoId }
    });
    
    res.status(200).json({ message: 'Notificação excluída com sucesso', ...resultado });
  } catch (error) {
    console.error('Erro ao excluir notificação:', error);
    res.status(500).json({ message: 'Erro ao excluir notificação', error: error.message });
  }
};