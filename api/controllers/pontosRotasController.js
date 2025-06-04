const PontoRota = require('../models/PontoRota.js');

// Obter todos os pontos de rotas
exports.getPontosRotas = async (req, res) => {
  try {
    const pontos = await PontoRota.findAll();
    res.status(200).json(pontos);
  } catch (error) {
    console.error('Erro ao buscar pontos de rotas:', error);
    res.status(500).json({ message: 'Erro ao buscar pontos de rotas' });
  }
};

// Obter ponto de rota por ID
exports.getPontoRotaById = async (req, res) => {
  try {
    const ponto = await PontoRota.findById(req.params.id);
    if (!ponto) {
      return res.status(404).json({ message: 'Ponto de rota não encontrado' });
    }
    res.status(200).json(ponto);
  } catch (error) {
    console.error('Erro ao buscar ponto de rota:', error);
    res.status(500).json({ message: 'Erro ao buscar ponto de rota' });
  }
};

// Obter pontos de uma rota específica
exports.getPontosByRouteId = async (req, res) => {
  try {
    const pontos = await PontoRota.findByRouteId(req.params.routeId);
    res.status(200).json(pontos);
  } catch (error) {
    console.error('Erro ao buscar pontos da rota:', error);
    res.status(500).json({ message: 'Erro ao buscar pontos da rota' });
  }
};

// Criar novo ponto de rota
exports.createPontoRota = async (req, res) => {
  try {
    const { route_id, sequence, latitude, longitude } = req.body;

    // Verificar se os campos obrigatórios foram fornecidos
    if (!route_id || sequence === undefined || !latitude || !longitude) {
      return res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios' });
    }

    const novoPonto = await PontoRota.create(req.body);
    res.status(201).json(novoPonto);
  } catch (error) {
    console.error('Erro ao criar ponto de rota:', error);
    res.status(500).json({ message: 'Erro ao criar ponto de rota' });
  }
};

// Criar múltiplos pontos de rota
exports.createManyPontosRota = async (req, res) => {
  try {
    const { routeId, pontos } = req.body;

    // Verificar se os campos obrigatórios foram fornecidos
    if (!routeId || !pontos || !Array.isArray(pontos) || pontos.length === 0) {
      return res.status(400).json({ message: 'Por favor, forneça uma rota válida e uma lista de pontos' });
    }

    // Verificar se todos os pontos têm os campos obrigatórios
    for (const ponto of pontos) {
      if (ponto.sequence === undefined || !ponto.latitude || !ponto.longitude) {
        return res.status(400).json({ message: 'Todos os pontos devem ter sequence, latitude e longitude' });
      }
    }

    const novosPontos = await PontoRota.createMany(routeId, pontos);
    res.status(201).json(novosPontos);
  } catch (error) {
    console.error('Erro ao criar pontos de rota:', error);
    res.status(500).json({ message: 'Erro ao criar pontos de rota' });
  }
};

// Atualizar ponto de rota
exports.updatePontoRota = async (req, res) => {
  try {
    const result = await PontoRota.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ponto de rota não encontrado' });
    }
    res.status(200).json({ message: 'Ponto de rota atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar ponto de rota:', error);
    res.status(500).json({ message: 'Erro ao atualizar ponto de rota' });
  }
};

// Excluir ponto de rota
exports.deletePontoRota = async (req, res) => {
  try {
    const result = await PontoRota.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ponto de rota não encontrado' });
    }
    res.status(200).json({ message: 'Ponto de rota excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir ponto de rota:', error);
    res.status(500).json({ message: 'Erro ao excluir ponto de rota' });
  }
};

// Excluir todos os pontos de uma rota
exports.deletePontosByRouteId = async (req, res) => {
  try {
    await PontoRota.deleteByRouteId(req.params.routeId);
    res.status(200).json({ message: 'Pontos da rota excluídos com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pontos da rota:', error);
    res.status(500).json({ message: 'Erro ao excluir pontos da rota' });
  }
};