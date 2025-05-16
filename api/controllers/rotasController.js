const Rota = require('../models/Rota');

// Obter todas as rotas
exports.getRotas = async (req, res) => {
  try {
    const rotas = await Rota.findAll();
    res.status(200).json(rotas);
  } catch (error) {
    console.error('Erro ao buscar rotas:', error);
    res.status(500).json({ message: 'Erro ao buscar rotas' });
  }
};

// Obter rota por ID
exports.getRotaById = async (req, res) => {
  try {
    const rota = await Rota.findById(req.params.id);
    if (!rota) {
      return res.status(404).json({ message: 'Rota não encontrada' });
    }
    res.status(200).json(rota);
  } catch (error) {
    console.error('Erro ao buscar rota:', error);
    res.status(500).json({ message: 'Erro ao buscar rota' });
  }
};

// Obter rotas por criador
exports.getRotasByCreator = async (req, res) => {
  try {
    const rotas = await Rota.findByCreator(req.params.createdBy);
    res.status(200).json(rotas);
  } catch (error) {
    console.error('Erro ao buscar rotas do criador:', error);
    res.status(500).json({ message: 'Erro ao buscar rotas do criador' });
  }
};

// Obter rotas ativas
exports.getActiveRotas = async (req, res) => {
  try {
    const rotas = await Rota.findActive();
    res.status(200).json(rotas);
  } catch (error) {
    console.error('Erro ao buscar rotas ativas:', error);
    res.status(500).json({ message: 'Erro ao buscar rotas ativas' });
  }
};

// Obter rotas por dificuldade
exports.getRotasByDifficulty = async (req, res) => {
  try {
    const rotas = await Rota.findByDifficulty(req.params.difficulty);
    res.status(200).json(rotas);
  } catch (error) {
    console.error('Erro ao buscar rotas por dificuldade:', error);
    res.status(500).json({ message: 'Erro ao buscar rotas por dificuldade' });
  }
};

// Criar nova rota
exports.createRota = async (req, res) => {
  try {
    const { name, start_point, end_point, distance, estimated_time, difficulty, created_by } = req.body;

    // Verificar se os campos obrigatórios foram fornecidos
    if (!distance || !estimated_time || !difficulty || !created_by) {
      return res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios' });
    }

    const novaRota = await Rota.create(req.body);
    res.status(201).json(novaRota);
  } catch (error) {
    console.error('Erro ao criar rota:', error);
    res.status(500).json({ message: 'Erro ao criar rota' });
  }
};

// Atualizar rota
exports.updateRota = async (req, res) => {
  try {
    const result = await Rota.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rota não encontrada' });
    }
    res.status(200).json({ message: 'Rota atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar rota:', error);
    res.status(500).json({ message: 'Erro ao atualizar rota' });
  }
};

// Excluir rota
exports.deleteRota = async (req, res) => {
  try {
    const result = await Rota.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rota não encontrada' });
    } else {
      res.status(200).json({ message: 'Rota excluída com sucesso' });
    }

  } catch (error) {
    console.error('Erro ao excluir rota:', error);
    res.status(500).json({ message: 'Erro ao excluir rota' });
  }
};

// Ativar/desativar rota
exports.toggleActiveRota = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (isActive === undefined) {
      return res.status(400).json({ message: 'Por favor, forneça o status de ativação' });
    }
    
    const result = await Rota.toggleActive(req.params.id, isActive);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rota não encontrada' });
    }
    
    const status = isActive ? 'ativada' : 'desativada';
    res.status(200).json({ message: `Rota ${status} com sucesso` });
  } catch (error) {
    console.error('Erro ao alterar status da rota:', error);
    res.status(500).json({ message: 'Erro ao alterar status da rota' });
  }
};