const pool = require('../config/db');

class Log {
  // Buscar todos os logs
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM logs ORDER BY created_at DESC');
    return rows;
  }

  // Buscar log por ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM logs WHERE id = ?', [id]);
    return rows[0];
  }

  // Buscar logs por usuário
  static async findByUsuario(usuarioId) {
    const [rows] = await pool.query('SELECT * FROM logs WHERE usuario_id = ? ORDER BY created_at DESC', [usuarioId]);
    return rows;
  }

  // Buscar logs por empresa
  static async findByEmpresa(empresaId) {
    const [rows] = await pool.query('SELECT * FROM logs WHERE empresa_id = ? ORDER BY created_at DESC', [empresaId]);
    return rows;
  }

  // Buscar logs por ação
  static async findByAcao(acao) {
    const [rows] = await pool.query('SELECT * FROM logs WHERE acao = ? ORDER BY created_at DESC', [acao]);
    return rows;
  }

  // Criar novo log
  static async create(logData) {
    const { usuario_id, empresa_id, acao, resourse, descricao, detalhes } = logData;
    const created_at = new Date();
    
    const [result] = await pool.query(
      'INSERT INTO logs (usuario_id, empresa_id, acao, resourse, descricao, detalhes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usuario_id, empresa_id, acao, resourse, descricao, JSON.stringify(detalhes), created_at]
    );
    
    return { id: result.insertId, ...logData, created_at };
  }

  // Atualizar log
  static async update(id, logData) {
    const { descricao, detalhes } = logData;
    const updated_at = new Date();
    
    const [result] = await pool.query(
      'UPDATE logs SET descricao = ?, detalhes = ?, updated_at = ? WHERE id = ?',
      [descricao, JSON.stringify(detalhes), updated_at, id]
    );
    
    return result;
  }

  // Excluir log
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM logs WHERE id = ?', [id]);
    return result;
  }
}

module.exports = Log;