const Chat = require('../models/Chat');

// Obter todas as mensagens
exports.getMensagens = async (req, res) => {
  try {
    const mensagens = await Chat.findAll();
    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
};

// Obter mensagem por ID
exports.getMensagemById = async (req, res) => {
  try {
    const mensagem = await Chat.findById(req.params.id);
    if (!mensagem) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }
    res.status(200).json(mensagem);
  } catch (error) {
    console.error('Erro ao buscar mensagem:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagem' });
  }
};

// Obter mensagens por usuário
exports.getMensagensByUsuario = async (req, res) => {
  try {
    const mensagens = await Chat.findByUsuario(req.params.usuarioId);
    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens do usuário' });
  }
};

// Obter mensagens por empresa
exports.getMensagensByEmpresa = async (req, res) => {
  try {
    const mensagens = await Chat.findByEmpresa(req.params.empresaId);
    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens da empresa:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens da empresa' });
  }
};

// Obter mensagens por vaga
exports.getMensagensByVaga = async (req, res) => {
  try {
    const mensagens = await Chat.findByVaga(req.params.vagaId);
    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens da vaga:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens da vaga' });
  }
};

// Obter conversa entre usuário e empresa
exports.getConversation = async (req, res) => {
  try {
    const { usuarioId, empresaId } = req.params;
    const mensagens = await Chat.findConversation(usuarioId, empresaId);
    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    res.status(500).json({ message: 'Erro ao buscar conversa' });
  }
};

// Criar nova mensagem
exports.createMensagem = async (req, res) => {
  try {
    const { usuario_id, empresa_id, vaga_id, mensagem } = req.body;

    // Verificar se os campos obrigatórios foram fornecidos
    if (!usuario_id || !empresa_id || !mensagem) {
      return res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios' });
    }

    const novaMensagem = await Chat.create(req.body);
    res.status(201).json(novaMensagem);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    res.status(500).json({ message: 'Erro ao criar mensagem' });
  }
};

// Atualizar mensagem
exports.updateMensagem = async (req, res) => {
  try {
    const result = await Chat.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }
    res.status(200).json({ message: 'Mensagem atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar mensagem:', error);
    res.status(500).json({ message: 'Erro ao atualizar mensagem' });
  }
};

// Excluir mensagem
exports.deleteMensagem = async (req, res) => {
  try {
    const result = await Chat.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }
    res.status(200).json({ message: 'Mensagem excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir mensagem:', error);
    res.status(500).json({ message: 'Erro ao excluir mensagem' });
  }
};