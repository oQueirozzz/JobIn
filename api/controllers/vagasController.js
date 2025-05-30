const Vaga = require('../models/Vaga');
const Notificacao = require('../models/Notificacao');
const logsController = require('./logsController');

// Obter todas as vagas
exports.getVagas = async (req, res) => {
  try {
    const vagas = await Vaga.findAll();
    res.status(200).json(vagas);
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    res.status(500).json({ message: 'Erro ao buscar vagas' });
  }
};

// Obter uma vaga pelo ID
exports.getVagaById = async (req, res) => {
  try {
    const vaga = await Vaga.findById(req.params.id);
    if (!vaga) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }
    res.status(200).json(vaga);
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    res.status(500).json({ message: 'Erro ao buscar vaga' });
  }
};

// Obter vagas por empresa
exports.getVagasByEmpresa = async (req, res) => {
  try {
    const vagas = await Vaga.findByEmpresa(req.params.empresaId);
    res.status(200).json(vagas);
  } catch (error) {
    console.error('Erro ao buscar vagas da empresa:', error);
    res.status(500).json({ message: 'Erro ao buscar vagas da empresa' });
  }
};


// Criar uma nova vaga
exports.createVaga = async (req, res) => {
  try {
    const {
      empresa_id,
      nome_vaga,
      nome_empresa,
      descricao,
      tipo_vaga,
      local_vaga,
      categoria,
      salario
    } = req.body;

    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!empresa_id || !nome_vaga || !nome_empresa || !descricao || !tipo_vaga || !local_vaga || !categoria|| !salario) {
      return res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios.' });
    }

    // Criar a vaga
    const novaVaga = await Vaga.create(req.body);

    // Registrar log de criação de vaga
    await logsController.logCriacaoVaga(empresa_id, novaVaga.id, nome_vaga);

    // Criar notificação
    await Notificacao.create({
      candidaturas_id: 0,
      empresas_id: empresa_id,
      usuarios_id: 0,
      mensagem_empresa: `Nova vaga criada: ${nome_vaga}`,
      mensagem_usuario: null
    });

    return res.status(201).json(novaVaga);
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    return res.status(500).json({ message: 'Erro ao criar vaga.' });
  }
};

// Atualizar uma vaga
exports.updateVaga = async (req, res) => {
  try {
    const result = await Vaga.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }
    res.status(200).json({ message: 'Vaga atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    res.status(500).json({ message: 'Erro ao atualizar vaga' });
  }
};

// Excluir uma vaga
exports.deleteVaga = async (req, res) => {
  try {
    const result = await Vaga.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }
    res.status(200).json({ message: 'Vaga excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir vaga:', error);
    res.status(500).json({ message: 'Erro ao excluir vaga' });
  }
};