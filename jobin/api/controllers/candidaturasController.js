const Candidatura = require('../models/Candidatura');

// Obter todas as candidaturas
exports.getCandidaturas = async (req, res) => {
  try {
    const candidaturas = await Candidatura.findAll();
    res.status(200).json(candidaturas);
  } catch (error) {
    console.error('Erro ao buscar candidaturas:', error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas' });
  }
};

// Obter uma candidatura pelo ID
exports.getCandidaturaById = async (req, res) => {
  try {
    const candidatura = await Candidatura.findById(req.params.id);
    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }
    res.status(200).json(candidatura);
  } catch (error) {
    console.error('Erro ao buscar candidatura:', error);
    res.status(500).json({ message: 'Erro ao buscar candidatura' });
  }
};

// Obter candidaturas por usuário
exports.getCandidaturasByUsuario = async (req, res) => {
  try {
    const candidaturas = await Candidatura.findByUsuario(req.params.usuarioId);
    res.status(200).json(candidaturas);
  } catch (error) {
    console.error('Erro ao buscar candidaturas do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas do usuário' });
  }
};

// Obter candidaturas por vaga
exports.getCandidaturasByVaga = async (req, res) => {
  try {
    const candidaturas = await Candidatura.findByVaga(req.params.vagaId);
    res.status(200).json(candidaturas);
  } catch (error) {
    console.error('Erro ao buscar candidaturas da vaga:', error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas da vaga' });
  }
};

// Criar uma nova candidatura
exports.createCandidatura = async (req, res) => {
  try {
    const { id_usuario, id_vaga } = req.body;

    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!id_usuario || !id_vaga) {
      return res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios' });
    }

    // Criar a candidatura
    const novaCandidatura = await Candidatura.create(req.body);

    res.status(201).json(novaCandidatura);
  } catch (error) {
    console.error('Erro ao criar candidatura:', error);
    res.status(500).json({ message: 'Erro ao criar candidatura' });
  }
};

// Atualizar uma candidatura
exports.updateCandidatura = async (req, res) => {
  try {
    const result = await Candidatura.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }
    res.status(200).json({ message: 'Candidatura atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar candidatura:', error);
    res.status(500).json({ message: 'Erro ao atualizar candidatura' });
  }
};

// Excluir uma candidatura
exports.deleteCandidatura = async (req, res) => {
  try {
    const result = await Candidatura.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }
    res.status(200).json({ message: 'Candidatura excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir candidatura:', error);
    res.status(500).json({ message: 'Erro ao excluir candidatura' });
  }
};