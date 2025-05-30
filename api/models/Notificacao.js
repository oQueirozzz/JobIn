const pool = require('../config/db');

class Notificacao {
  // Buscar todas as notificações
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM notificacao ORDER BY data_notificacao DESC');
    return rows;
  }

  // Buscar notificação por ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE id = ?', [id]);
    return rows[0];
  }

  // Buscar notificações por usuário
  static async findByUsuario(usuarioId) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE usuarios_id = ? ORDER BY data_notificacao DESC', [usuarioId]);
    return rows;
  }

  // Buscar notificações não lidas por usuário
  static async findNaoLidasByUsuario(usuarioId) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE usuarios_id = ? AND lida = FALSE ORDER BY data_notificacao DESC', [usuarioId]);
    return rows;
  }

  // Buscar notificações por empresa
  static async findByEmpresa(empresaId) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE empresas_id = ? ORDER BY id DESC', [empresaId]);
    return rows;
  }

  // Buscar notificações por candidatura
  static async findByCandidatura(candidaturaId) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE candidaturas_id = ? ORDER BY id DESC', [candidaturaId]);
    return rows;
  }

  // Criar nova notificação
  static async create(notificacaoData) {
    const { candidaturas_id, empresas_id, usuarios_id, mensagem, tipo } = notificacaoData;
    
    const [result] = await pool.query(
      'INSERT INTO notificacao (candidaturas_id, empresas_id, usuarios_id, mensagem, tipo) VALUES (?, ?, ?, ?, ?)',
      [candidaturas_id || null, empresas_id || null, usuarios_id, mensagem, tipo]
    );
    
    return { id: result.insertId, ...notificacaoData };
  }

  // Marcar notificação como lida
  static async marcarComoLida(id) {
    const [result] = await pool.query(
      'UPDATE notificacao SET lida = TRUE WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Marcar todas as notificações do usuário como lidas
  static async marcarTodasComoLidas(usuarioId) {
    const [result] = await pool.query(
      'UPDATE notificacao SET lida = TRUE WHERE usuarios_id = ?',
      [usuarioId]
    );
    return result.affectedRows;
  }

  // Atualizar notificação
  static async update(id, notificacaoData) {
    const { mensagem_usuario, mensagem_empresa } = notificacaoData;
    
    let query = 'UPDATE notificacao SET ';
    const values = [];
    const updateFields = [];

    if (mensagem_usuario !== undefined) {
      updateFields.push('mensagem_usuario = ?');
      values.push(mensagem_usuario);
    }

    if (mensagem_empresa !== undefined) {
      updateFields.push('mensagem_empresa = ?');
      values.push(mensagem_empresa);
    }

    if (updateFields.length === 0) {
      return { message: 'Nenhum campo para atualizar' };
    }

    query += updateFields.join(', ');
    query += ' WHERE id = ?';
    values.push(id);

    const [result] = await pool.query(query, values);
    return { affectedRows: result.affectedRows };
  }

  // Excluir notificação
  static async delete(id) {
    try {
      const notificacao = await this.findById(id);
      if (!notificacao) {
        return { affectedRows: 0, error: 'Notificação não encontrada' };
      }
      
      const [result] = await pool.query('DELETE FROM notificacao WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return { affectedRows: 0, error: 'Falha ao excluir notificação' };
      }
      
      return { affectedRows: result.affectedRows, success: true };
    } catch (error) {
      console.error('Erro no modelo ao excluir notificação:', error);
      throw error;
    }
  }
}

module.exports = Notificacao;