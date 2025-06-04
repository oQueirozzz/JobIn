const Log = require('../models/Log.js');

// Obter todos os logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ message: 'Erro ao buscar logs' });
  }
};

// Função utilitária para registrar logs em qualquer parte do sistema
exports.registrarLog = async (usuarioId, empresaId, acao, resource, descricao, detalhes) => {
  try {
    console.log('Registrando log:', { usuarioId, empresaId, acao, resource, descricao, detalhes });
    
    // Garantir que usuarioId seja um número válido ou 0 quando não disponível
    const usuario_id = usuarioId || 0;
    // Se empresaId for 0, usar NULL para evitar violação de chave estrangeira
    const empresa_id = empresaId === 0 ? null : empresaId;
    
    const logData = {
      usuario_id,
      empresa_id,
      acao,
      resource,
      descricao,
      detalhes
    };

    console.log('Dados do log a serem salvos:', logData);
    const log = await Log.create(logData);
    console.log('Log registrado com sucesso:', log);
    return log;
  } catch (error) {
    console.error('Erro ao registrar log:', error);
    return null;
  }
};

// Funções utilitárias para eventos comuns
exports.logLogin = async (usuarioId, empresaId, tipoUsuario) => {
  const entidade = tipoUsuario === 'usuario' ? 'USUARIO' : 'EMPRESA';
  const id = tipoUsuario === 'usuario' ? usuarioId : empresaId;
  
  return this.registrarLog(
    usuarioId,
    empresaId,
    'LOGIN',
    entidade,
    `Login realizado: ${entidade} ID ${id}`,
    { tipo_usuario: tipoUsuario }
  );
};

// Log de candidatura
exports.logCandidatura = async (usuarioId, empresaId, vagaId) => {
  return this.registrarLog(
    usuarioId,
    empresaId,
    'CANDIDATURA',
    'VAGA',
    `Candidatura realizada: Usuário ID ${usuarioId} para Vaga ID ${vagaId}`,
    { vaga_id: vagaId }
  );
};

// Log de atualização de perfil
exports.logAtualizacaoPerfil = async (usuarioId, empresaId, tipoUsuario) => {
  const entidade = tipoUsuario === 'usuario' ? 'USUARIO' : 'EMPRESA';
  const id = tipoUsuario === 'usuario' ? usuarioId : empresaId;
  
  return this.registrarLog(
    usuarioId,
    empresaId,
    'ATUALIZAR',
    entidade,
    `Perfil atualizado: ${entidade} ID ${id}`,
    { tipo_usuario: tipoUsuario }
  );
};

// Log de criação de vaga
exports.logCriacaoVaga = async (empresaId, vagaId, nomeVaga) => {
  return this.registrarLog(
    0,
    empresaId,
    'CRIAR',
    'VAGA',
    `Vaga criada: ${nomeVaga}`,
    { vaga_id: vagaId }
  );
};

// Log de mensagem no chat
exports.logMensagemChat = async (usuarioId, empresaId, vagaId) => {
  return this.registrarLog(
    usuarioId,
    empresaId,
    'MENSAGEM',
    'CHAT',
    `Nova mensagem no chat: Usuário ID ${usuarioId} e Empresa ID ${empresaId}`,
    { vaga_id: vagaId }
  );
};


// Obter log por ID
exports.getLogById = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Log não encontrado' });
    }
    res.status(200).json(log);
  } catch (error) {
    console.error('Erro ao buscar log:', error);
    res.status(500).json({ message: 'Erro ao buscar log' });
  }
};

// Obter logs por usuário
exports.getLogsByUsuario = async (req, res) => {
  try {
    const logs = await Log.findByUsuario(req.params.usuarioId);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar logs do usuário' });
  }
};

// Obter logs por empresa
exports.getLogsByEmpresa = async (req, res) => {
  try {
    const logs = await Log.findByEmpresa(req.params.empresaId);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs da empresa:', error);
    res.status(500).json({ message: 'Erro ao buscar logs da empresa' });
  }
};

// Obter logs por ação
exports.getLogsByAcao = async (req, res) => {
  try {
    const logs = await Log.findByAcao(req.params.acao);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs por ação:', error);
    res.status(500).json({ message: 'Erro ao buscar logs por ação' });
  }
};

// Criar novo log
exports.createLog = async (req, res) => {
  try {
    const { usuario_id, empresa_id, acao, resourse } = req.body;

    // Verificar se os campos obrigatórios foram fornecidos
    if (!usuario_id || !empresa_id || !acao || !resourse) {
      return res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios' });
    }

    const novoLog = await Log.create(req.body);
    res.status(201).json(novoLog);
  } catch (error) {
    console.error('Erro ao criar log:', error);
    res.status(500).json({ message: 'Erro ao criar log' });
  }
};

// Atualizar log
exports.updateLog = async (req, res) => {
  try {
    const result = await Log.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Log não encontrado' });
    }
    res.status(200).json({ message: 'Log atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar log:', error);
    res.status(500).json({ message: 'Erro ao atualizar log' });
  }
};

// Excluir log
exports.deleteLog = async (req, res) => {
  try {
    const result = await Log.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Log não encontrado' });
    }
    res.status(200).json({ message: 'Log excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir log:', error);
    res.status(500).json({ message: 'Erro ao excluir log' });
  }
};