const pool = require('../config/db.js');

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
  static async create(mensagemData) {
    const { usuario_id, empresa_id, vaga_id, mensagem } = mensagemData;
    const data = new Date();
    
    const [result] = await pool.query(
      'INSERT INTO chat (usuario_id, empresa_id, vaga_id, mensagem, data) VALUES (?, ?, ?, ?, ?)',
      [usuario_id, empresa_id, vaga_id, mensagem, data]
    );
    
    return { id: result.insertId, ...mensagemData, data };
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
}

module.exports = Chat;