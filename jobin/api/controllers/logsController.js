const Log = require('../models/Log');

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