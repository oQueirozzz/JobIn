import Candidatura from '../models/Candidatura.js';
import Vaga from '../models/Vaga.js';
import Usuario from '../models/Usuario.js';
import Notificacao from '../models/Notificacao.js';
import * as logsController from './logsController.js';
import NotificacaoService from '../services/notificacaoService.js';

// Obter todas as candidaturas
export const getCandidaturas = async (req, res) => {
  try {
    const candidaturas = await Candidatura.findAll();
    res.status(200).json(candidaturas);
  } catch (error) {
    console.error('Erro ao buscar candidaturas:', error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas' });
  }
};

// Obter uma candidatura pelo ID
export const getCandidaturaById = async (req, res) => {
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
export const getCandidaturasByUsuario = async (req, res) => {
  try {
    const candidaturas = await Candidatura.findByUsuario(req.params.usuarioId);
    res.status(200).json(candidaturas);
  } catch (error) {
    console.error('Erro ao buscar candidaturas do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas do usuário' });
  }
};

// Obter candidaturas por vaga
export const getCandidaturasByVaga = async (req, res) => {
  try {
    const candidaturas = await Candidatura.findByVaga(req.params.vagaId);
    res.status(200).json(candidaturas);
  } catch (error) {
    console.error('Erro ao buscar candidaturas da vaga:', error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas da vaga' });
  }
};

// Criar candidatura
export const createCandidatura = async (req, res) => {
  try {
    const { id_usuario, id_vaga, curriculo_usuario } = req.body;

    // Validar campos obrigatórios
    if (!id_usuario || !id_vaga) {
      return res.status(400).json({ 
        message: 'ID do usuário e ID da vaga são obrigatórios',
        error: 'CAMPOS_OBRIGATORIOS'
      });
    }

    // Contar quantas vezes o usuário já se candidatou para esta vaga (incluindo candidaturas removidas)
    const totalCandidaturas = await Candidatura.countCandidaturasByUsuarioEVaga(id_usuario, id_vaga);
    
    // Buscar detalhes da vaga para mensagens mais informativas
    const vaga = await Vaga.findById(id_vaga);
    if (!vaga) {
      return res.status(404).json({ 
        message: 'Vaga não encontrada',
        error: 'VAGA_NAO_ENCONTRADA'
      });
    }

    if (totalCandidaturas >= 2) {
      return res.status(400).json({ 
        message: `Você já atingiu o limite máximo de candidaturas para a vaga "${vaga.nome_vaga}". Você não pode mais se candidatar para esta vaga, mesmo removendo candidaturas anteriores.`,
        error: 'LIMITE_EXCEDIDO',
        candidaturasRestantes: 0,
        vaga: vaga.nome_vaga,
        empresa: vaga.nome_empresa
      });
    }

    // Verificar se já existe uma candidatura ativa
    const candidaturaExistente = await Candidatura.findByUsuarioEVaga(id_usuario, id_vaga);
    if (candidaturaExistente) {
      return res.status(400).json({ 
        message: `Você já tem uma candidatura ativa para a vaga "${vaga.nome_vaga}"`,
        error: 'CANDIDATURA_ATIVA_EXISTENTE',
        vaga: vaga.nome_vaga,
        empresa: vaga.nome_empresa
      });
    }

    // Criar a candidatura
    const candidatura = await Candidatura.create({
      id_usuario,
      id_vaga,
      empresa_id: vaga.empresa_id,
      curriculo_usuario: curriculo_usuario || null
    });

    // Criar notificação
    await NotificacaoService.criarNotificacaoCandidaturaCriada(id_usuario, vaga.empresa_id, id_vaga, candidatura.id);

    res.status(201).json({
      ...candidatura,
      message: `Candidatura criada com sucesso para a vaga "${vaga.nome_vaga}"`,
      candidaturasRestantes: 2 - (totalCandidaturas + 1),
      vaga: vaga.nome_vaga,
      empresa: vaga.nome_empresa
    });
  } catch (error) {
    console.error('Erro ao criar candidatura:', error);
    res.status(500).json({ 
      message: 'Erro ao criar candidatura',
      error: 'ERRO_INTERNO'
    });
  }
};

// Atualizar status da candidatura
export const updateStatusCandidatura = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar status
    const statusValidos = ['PENDENTE', 'APROVADO', 'REJEITADO', 'EM_ESPERA'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ 
        message: 'Status inválido. Os status válidos são: PENDENTE, APROVADO, REJEITADO, EM_ESPERA',
        error: 'STATUS_INVALIDO'
      });
    }

    // Buscar a candidatura
    const candidatura = await Candidatura.findById(id);
    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }

    // Atualizar o status
    const resultado = await Candidatura.update(id, { status });
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }

    // Criar notificação baseada no status
    switch (status) {
      case 'APROVADO':
        await NotificacaoService.criarNotificacaoCandidaturaAprovada(
          candidatura.id_usuario,
          candidatura.empresa_id,
          candidatura.id_vaga,
          candidatura.id
        );
        break;
      case 'REJEITADO':
        await NotificacaoService.criarNotificacaoCandidaturaRejeitada(
          candidatura.id_usuario,
          candidatura.empresa_id,
          candidatura.id_vaga,
          candidatura.id
        );
        break;
      case 'EM_ESPERA':
        await NotificacaoService.criarNotificacaoCandidaturaEmEspera(
          candidatura.id_usuario,
          candidatura.empresa_id,
          candidatura.id_vaga,
          candidatura.id
        );
        break;
    }

    res.status(200).json({ message: 'Status da candidatura atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status da candidatura:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar status da candidatura',
      error: 'ERRO_INTERNO'
    });
  }
};

// Remover candidatura
export const deleteCandidatura = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmacao } = req.body;

    // Verificar se a confirmação foi fornecida
    if (!confirmacao) {
      return res.status(400).json({ 
        message: 'Por favor, confirme a remoção da candidatura',
        requiresConfirmation: true
      });
    }

    // Buscar a candidatura antes de excluir
    const candidatura = await Candidatura.findById(id);
    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }

    // Criar notificação
    await NotificacaoService.criarNotificacaoCandidaturaRemovida(
      candidatura.id_usuario,
      candidatura.empresa_id,
      candidatura.id_vaga,
      candidatura.id
    );

    // Excluir a candidatura
    const resultado = await Candidatura.delete(id);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }

    res.status(200).json({ 
      message: 'Candidatura removida com sucesso',
      candidaturasRestantes: await Candidatura.countCandidaturasByUsuarioEVaga(candidatura.id_usuario, candidatura.id_vaga)
    });
  } catch (error) {
    console.error('Erro ao remover candidatura:', error);
    res.status(500).json({ message: 'Erro ao remover candidatura' });
  }
};

// Função para notificar sobre status da candidatura
export const atualizarStatusCandidatura = async (req, res) => {
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