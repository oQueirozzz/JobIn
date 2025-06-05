import pool from '../config/db.js';

class Chat {
  // Buscar todas as mensagens
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM chat');
    return rows;
  }

  // Buscar mensagem por ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM chat WHERE id = ?', [id]);
    return rows[0];
  }

  // Buscar mensagens por usuário
  static async findByUsuario(usuarioId) {
    const [rows] = await pool.query('SELECT * FROM chat WHERE usuario_id = ?', [usuarioId]);
    return rows;
  }

  // Buscar mensagens por empresa
  static async findByEmpresa(empresaId) {
    const [rows] = await pool.query('SELECT * FROM chat WHERE empresa_id = ?', [empresaId]);
    return rows;
  }

  // Buscar mensagens por vaga
  static async findByVaga(vagaId) {
    const [rows] = await pool.query('SELECT * FROM chat WHERE vaga_id = ?', [vagaId]);
    return rows;
  }

  // Buscar conversa entre usuário e empresa
  static async findConversation(usuarioId, empresaId) {
    const [rows] = await pool.query(
      'SELECT * FROM chat WHERE usuario_id = ? AND empresa_id = ? ORDER BY data ASC',
      [usuarioId, empresaId]
    );
    return rows;
  }

  // Criar nova mensagem
  static async create(messageData) {
    const { sender_id, receiver_id, sender_type, receiver_type, message, vaga_id } = messageData;
    
    const query = `
      INSERT INTO chat (sender_id, receiver_id, sender_type, receiver_type, message, vaga_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [sender_id, receiver_id, sender_type, receiver_type, message, vaga_id];
    
    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao criar mensagem:', error);
      throw error;
    }
  }

  // Atualizar mensagem
  static async update(id, mensagemData) {
    const { mensagem } = mensagemData;
    
    const [result] = await pool.query(
      'UPDATE chat SET mensagem = ? WHERE id = ?',
      [mensagem, id]
    );
    
    return result;
  }

  // Excluir mensagem
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM chat WHERE id = ?', [id]);
    return result;
  }

  static async getConversations(userId, userType) {
    const query = `
      WITH last_messages AS (
        SELECT DISTINCT ON (
          CASE 
            WHEN sender_id = $1 AND sender_type = $2 THEN receiver_id
            ELSE sender_id
          END,
          CASE 
            WHEN sender_id = $1 AND sender_type = $2 THEN receiver_type
            ELSE sender_type
          END
        )
          CASE 
            WHEN sender_id = $1 AND sender_type = $2 THEN receiver_id
            ELSE sender_id
          END as other_user_id,
          CASE 
            WHEN sender_id = $1 AND sender_type = $2 THEN receiver_type
            ELSE sender_type
          END as other_user_type,
          message as last_message,
          created_at as last_message_time,
          CASE 
            WHEN sender_id = $1 AND sender_type = $2 THEN true
            ELSE false
          END as is_sender
        FROM chat
        WHERE (sender_id = $1 AND sender_type = $2) OR (receiver_id = $1 AND receiver_type = $2)
        ORDER BY other_user_id, other_user_type, created_at DESC
      )
      SELECT 
        lm.*,
        CASE 
          WHEN lm.other_user_type = 'user' THEN u.nome
          WHEN lm.other_user_type = 'company' THEN e.nome
        END as receiver_name,
        CASE 
          WHEN lm.other_user_type = 'user' THEN u.foto
          WHEN lm.other_user_type = 'company' THEN e.logo
        END as receiver_image
      FROM last_messages lm
      LEFT JOIN usuarios u ON lm.other_user_id = u.id AND lm.other_user_type = 'user'
      LEFT JOIN empresas e ON lm.other_user_id = e.id AND lm.other_user_type = 'company'
      ORDER BY lm.last_message_time DESC
    `;
    
    try {
      const { rows } = await pool.query(query, [userId, userType]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      throw error;
    }
  }

  static async getMessages(userId, otherUserId, userType, otherUserType) {
    const query = `
      SELECT 
        c.*,
        CASE 
          WHEN c.sender_type = 'user' THEN u.nome
          WHEN c.sender_type = 'company' THEN e.nome
        END as sender_name,
        CASE 
          WHEN c.sender_type = 'user' THEN u.foto
          WHEN c.sender_type = 'company' THEN e.logo
        END as sender_image
      FROM chat c
      LEFT JOIN usuarios u ON c.sender_id = u.id AND c.sender_type = 'user'
      LEFT JOIN empresas e ON c.sender_id = e.id AND c.sender_type = 'company'
      WHERE (c.sender_id = $1 AND c.sender_type = $2 AND c.receiver_id = $3 AND c.receiver_type = $4)
         OR (c.sender_id = $3 AND c.sender_type = $4 AND c.receiver_id = $1 AND c.receiver_type = $2)
      ORDER BY c.created_at ASC
    `;
    
    try {
      const { rows } = await pool.query(query, [userId, userType, otherUserId, otherUserType]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw error;
    }
  }

  static async getUnreadCount(userId, otherUserId, userType, otherUserType) {
    const query = `
      SELECT COUNT(*) as unread_count
      FROM chat
      WHERE receiver_id = $1 
      AND receiver_type = $2
      AND sender_id = $3
      AND sender_type = $4
      AND lida = false
    `;
    
    try {
      const { rows } = await pool.query(query, [userId, userType, otherUserId, otherUserType]);
      return parseInt(rows[0].unread_count);
    } catch (error) {
      console.error('Erro ao contar mensagens não lidas:', error);
      throw error;
    }
  }

  static async markAsRead(userId, otherUserId, userType, otherUserType) {
    const query = `
      UPDATE chat
      SET lida = true
      WHERE receiver_id = $1 
      AND receiver_type = $2
      AND sender_id = $3
      AND sender_type = $4
      AND lida = false
      RETURNING *
    `;
    
    try {
      const { rows } = await pool.query(query, [userId, userType, otherUserId, otherUserType]);
      return rows;
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
      throw error;
    }
  }
}

export default Chat;