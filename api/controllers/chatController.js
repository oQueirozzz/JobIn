import Chat from '../models/Chat.js';
import Notificacao from '../models/Notificacao.js';
import pool from '../config/db.js';

// Obter todas as mensagens
export const getMensagens = async (req, res) => {
  try {
    const mensagens = await Chat.findAll();
    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
};

// Obter mensagem por ID
export const getMensagemById = async (req, res) => {
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
export const getMensagensByUsuario = async (req, res) => {
  try {
    const mensagens = await Chat.findByUsuario(req.params.usuarioId);
    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens do usuário' });
  }
};

// Obter mensagens por empresa
export const getMensagensByEmpresa = async (req, res) => {
  try {
    const mensagens = await Chat.findByEmpresa(req.params.empresaId);
    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens da empresa:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens da empresa' });
  }
};

// Obter mensagens por vaga
export const getMensagensByVaga = async (req, res) => {
  try {
    const mensagens = await Chat.findByVaga(req.params.vagaId);
    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens da vaga:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens da vaga' });
  }
};

// Obter conversa entre usuário e empresa
export const getConversation = async (req, res) => {
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
export const createMensagem = async (req, res) => {
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
export const updateMensagem = async (req, res) => {
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
export const deleteMensagem = async (req, res) => {
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

export const sendMessage = async (req, res) => {
  try {
    const { receiver_id, receiver_type, message, vaga_id } = req.body;
    const sender_id = req.usuario.id;
    const sender_type = req.usuario.type === 'company' ? 'company' : 'user';

    // Create the message
    const newMessage = await Chat.create({
      sender_id,
      receiver_id,
      sender_type,
      receiver_type,
      message,
      vaga_id
    });

    // Create notification for the receiver
    await Notificacao.create({
      usuario_id: receiver_id,
      tipo: 'mensagem',
      mensagem: `Nova mensagem de ${req.usuario.nome}`,
      remetente_id: sender_id,
      remetente_tipo: sender_type,
      vaga_id
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ message: 'Erro ao enviar mensagem' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.usuario.id;
    const userType = req.usuario.type === 'company' ? 'company' : 'user';

    const conversations = await Chat.getConversations(userId, userType);
    
    // Get unread message counts for each conversation
    const conversationsWithUnread = await Promise.all(conversations.map(async (conv) => {
      const unreadCount = await Chat.getUnreadCount(userId, conv.other_user_id, userType, conv.other_user_type);
      return {
        ...conv,
        unread_count: unreadCount
      };
    }));

    res.json(conversationsWithUnread);
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    res.status(500).json({ message: 'Erro ao buscar conversas' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { otherUserId, otherUserType } = req.params;
    const userId = req.usuario.id;
    const userType = req.usuario.type === 'company' ? 'company' : 'user';

    const messages = await Chat.getMessages(userId, otherUserId, userType, otherUserType);
    res.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.usuario.id;
    const userType = req.usuario.type === 'company' ? 'company' : 'user';

    // Search in both users and companies tables
    const searchQuery = `
      (
        SELECT 
          id,
          nome as name,
          'user' as type,
          foto as image,
          email,
          descricao as description
        FROM usuarios 
        WHERE (LOWER(nome) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
        AND id != $2
        AND tipo = 'usuario'
      )
      UNION
      (
        SELECT 
          id,
          nome as name,
          'company' as type,
          logo as image,
          email,
          descricao as description
        FROM empresas 
        WHERE (LOWER(nome) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
        AND id != $2
      )
      ORDER BY name
      LIMIT 10
    `;

    const { rows } = await pool.query(searchQuery, [`%${query}%`, userId]);
    
    // Format the results to include additional information
    const formattedResults = rows.map(row => ({
      ...row,
      image: row.image || (row.type === 'user' ? 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' : 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato'),
      description: row.description || (row.type === 'user' ? 'Usuário' : 'Empresa')
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};