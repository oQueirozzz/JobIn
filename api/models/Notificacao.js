const pool = require('../config/db');

class Notificacao {
  // Buscar todas as notificações
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM notificacao ORDER BY id DESC');
    return rows;
  }

  // Buscar notificação por ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE id = ?', [id]);
    return rows[0];
  }

  // Buscar notificações por usuário
  static async findByUsuario(usuarioId) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE usuarios_id = ? ORDER BY id DESC', [usuarioId]);
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
    const { candidaturas_id, empresas_id, usuarios_id, mensagem_usuario, mensagem_empresa } = notificacaoData;
    
    const [result] = await pool.query(
      'INSERT INTO notificacao (candidaturas_id, empresas_id, usuarios_id, mensagem_usuario, mensagem_empresa) VALUES (?, ?, ?, ?, ?)',
      [candidaturas_id, empresas_id, usuarios_id, mensagem_usuario || null, mensagem_empresa || null]
    );
    
    return { id: result.insertId, ...notificacaoData };
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
    const [result] = await pool.query('DELETE FROM notificacao WHERE id = ?', [id]);
    return { affectedRows: result.affectedRows };
  }
}

module.exports = Notificacao;