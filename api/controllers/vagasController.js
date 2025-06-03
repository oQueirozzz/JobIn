const Vaga = require('../models/Vaga');
const Notificacao = require('../models/Notificacao');
const logsController = require('./logsController');
const NotificacaoService = require('../services/notificacaoService');

// Obter todas as vagas
exports.getVagas = async (req, res) => {
  try {
    console.log('Iniciando busca de vagas no controlador...');
    const vagas = await Vaga.findAll();
    console.log('Vagas encontradas:', vagas);
    
    // Garantir que sempre retornamos um array
    const resultado = Array.isArray(vagas) ? vagas : [];
    console.log('Resultado final a ser enviado:', resultado);
    
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    // Em caso de erro, retornar um array vazio
    res.status(200).json([]);
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
      requisitos,
      salario
    } = req.body;

    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!empresa_id || !nome_vaga || !nome_empresa || !descricao || !tipo_vaga || !local_vaga || !categoria || !requisitos) {
      return res.status(400).json({ 
        message: 'Por favor, forneça todos os campos obrigatórios: empresa_id, nome_vaga, nome_empresa, descricao, tipo_vaga, local_vaga, categoria e requisitos.' 
      });
    }

    // Criar a vaga
    const novaVaga = await Vaga.create(req.body);

    // Registrar log de criação de vaga
    await logsController.logCriacaoVaga(empresa_id, novaVaga.id, nome_vaga);

    // Criar notificação
    await NotificacaoService.criarNotificacaoVagaCriada(empresa_id, novaVaga.id);

    return res.status(201).json(novaVaga);
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    return res.status(500).json({ message: 'Erro ao criar vaga.' });
  }
};

// Atualizar uma vaga
exports.updateVaga = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    // Buscar a vaga antes de atualizar
    const vaga = await Vaga.findById(id);
    if (!vaga) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Atualizar a vaga
    const resultado = await Vaga.update(id, dadosAtualizados);
    
    if (!resultado) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Buscar todas as candidaturas para esta vaga
    const candidaturas = await require('../models/Candidatura').findByVaga(id);

    // Criar notificação para cada candidato e para a empresa
    for (const candidatura of candidaturas) {
      await NotificacaoService.criarNotificacaoVagaAtualizada(
        candidatura.id_usuario,
        vaga.empresa_id,
        id
      );
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
    const { id } = req.params;
    
    // Buscar a vaga antes de excluir
    const vaga = await Vaga.findById(id);
    if (!vaga) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Buscar todas as candidaturas para esta vaga
    const candidaturas = await require('../models/Candidatura').findByVaga(id);

    // Excluir a vaga
    const resultado = await Vaga.delete(id);
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Criar notificação para cada candidato e para a empresa
    for (const candidatura of candidaturas) {
      await NotificacaoService.criarNotificacaoVagaExcluida(
        candidatura.id_usuario,
        vaga.empresa_id,
        id
      );
    }

    res.status(200).json({ message: 'Vaga excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir vaga:', error);
    res.status(500).json({ message: 'Erro ao excluir vaga' });
  }
};