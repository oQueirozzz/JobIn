const Candidatura = require('../models/Candidatura');
const Vaga = require('../models/Vaga');
const Usuario = require('../models/Usuario');
const Notificacao = require('../models/Notificacao');
const logsController = require('./logsController');

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
    
    // Buscar informações da vaga e empresa para o log e notificação
    const vaga = await Vaga.findById(id_vaga);
    const usuario = await Usuario.findById(id_usuario);
    
    if (vaga && usuario) {
      // Registrar log da candidatura
      await logsController.logCandidatura(id_usuario, vaga.empresa_id, id_vaga);
      
      // Criar notificação para a empresa
      await Notificacao.create({
        candidaturas_id: novaCandidatura.id,
        empresas_id: vaga.empresa_id,
        usuarios_id: id_usuario,
        mensagem_empresa: `O candidato ${usuario.nome} se candidatou para a vaga ${vaga.nome_vaga}`,
        mensagem_usuario: `Você se candidatou para a vaga ${vaga.nome_vaga} na empresa ${vaga.nome_empresa}`
      });
    }

    res.status(201).json(novaCandidatura);
  } catch (error) {
    console.error('Erro ao criar candidatura:', error);
    res.status(500).json({ message: 'Erro ao criar candidatura' });
  }
};

// Atualizar uma candidatura
exports.updateCandidatura = async (req, res) => {
  try {
    // Buscar a candidatura antes de atualizar para ter os dados para o log
    const candidaturaExistente = await Candidatura.findById(req.params.id);
    if (!candidaturaExistente) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }
    
    const result = await Candidatura.update(req.params.id, req.body);
    
    // Buscar informações da vaga e empresa para o log
    const vaga = await Vaga.findById(candidaturaExistente.id_vaga);
    
    if (vaga) {
      // Registrar log da atualização
      await logsController.registrarLog(
        candidaturaExistente.id_usuario,
        vaga.empresa_id,
        'ATUALIZAR',
        'CANDIDATURA',
        `Candidatura atualizada: ID ${req.params.id}`,
        { candidatura_id: req.params.id }
      );
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
    // Buscar a candidatura antes de excluir para ter os dados para o log
    const candidaturaExistente = await Candidatura.findById(req.params.id);
    if (!candidaturaExistente) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }
    
    // Buscar informações da vaga e empresa para o log
    const vaga = await Vaga.findById(candidaturaExistente.id_vaga);
    const usuario = await Usuario.findById(candidaturaExistente.id_usuario);
    
    if (vaga && usuario) {
      // Criar notificação para a empresa e usuário sobre a desistência
      await Notificacao.create({
        candidaturas_id: candidaturaExistente.id,
        empresas_id: vaga.empresa_id,
        usuarios_id: candidaturaExistente.id_usuario,
        mensagem_empresa: `O candidato ${usuario.nome} desistiu da candidatura para a vaga ${vaga.nome_vaga}`,
        mensagem_usuario: `Sua candidatura para a vaga ${vaga.nome_vaga} na empresa ${vaga.nome_empresa} foi cancelada`
      });
      
      // Registrar log da exclusão
      await logsController.registrarLog(
        candidaturaExistente.id_usuario,
        vaga.empresa_id,
        'EXCLUIR',
        'CANDIDATURA',
        `Candidatura excluída: ID ${req.params.id}`,
        { candidatura_id: req.params.id }
      );
    }
    
    const result = await Candidatura.delete(req.params.id);
    
    res.status(200).json({ message: 'Candidatura excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir candidatura:', error);
    res.status(500).json({ message: 'Erro ao excluir candidatura' });
  }
};

// Função para notificar sobre status da candidatura
exports.atualizarStatusCandidatura = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, mensagem } = req.body;
    
    // Verificar se a candidatura existe
    const candidatura = await Candidatura.findById(id);
    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }
    
    // Atualizar o status da candidatura
    const result = await Candidatura.update(id, { status });
    
    // Buscar informações da vaga e empresa para a notificação
    const vaga = await Vaga.findById(candidatura.id_vaga);
    
    if (vaga) {
      // Criar notificação para o usuário sobre a atualização de status
      await Notificacao.create({
        candidaturas_id: candidatura.id,
        empresas_id: vaga.empresa_id,
        usuarios_id: candidatura.id_usuario,
        mensagem_usuario: `Sua candidatura para a vaga ${vaga.nome_vaga} foi ${status}. ${mensagem || ''}`,
        mensagem_empresa: null
      });
      
      // Registrar log da atualização de status
      await logsController.registrarLog(
        candidatura.id_usuario,
        vaga.empresa_id,
        'ATUALIZAR_STATUS',
        'CANDIDATURA',
        `Status da candidatura atualizado para ${status}: ID ${id}`,
        { candidatura_id: id, status }
      );
    }
    
    res.status(200).json({ message: 'Status da candidatura atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status da candidatura:', error);
    res.status(500).json({ message: 'Erro ao atualizar status da candidatura' });
  }
};