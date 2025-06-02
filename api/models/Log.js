const db = require('../config/db');

class Log {
  // Buscar todos os logs
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM logs ORDER BY data_acao DESC');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      throw error;
    }
  }

  // Buscar log por ID
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM logs WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar log por ID:', error);
      throw error;
    }
  }

  // Buscar logs por usuário
  static async findByUsuario(usuarioId) {
    try {
      const [rows] = await db.query('SELECT * FROM logs WHERE usuario_id = ? ORDER BY data_acao DESC', [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar logs por usuário:', error);
      throw error;
    }
  }

  // Buscar logs por empresa
  static async findByEmpresa(empresaId) {
    try {
      const [rows] = await db.query('SELECT * FROM logs WHERE empresa_id = ? ORDER BY data_acao DESC', [empresaId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar logs por empresa:', error);
      throw error;
    }
  }

  // Buscar logs por ação
  static async findByAcao(acao) {
    try {
      const [rows] = await db.query('SELECT * FROM logs WHERE acao = ? ORDER BY created_at DESC', [acao]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar logs por ação:', error);
      throw error;
    }
  }

  // Criar novo log
  static async create(logData) {
    try {
      console.log('Criando log com dados:', logData);

      const query = `
        INSERT INTO logs (
          usuario_id,
          empresa_id,
          acao,
          resourse,
          descricao,
          detalhes,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;

      const values = [
        logData.usuario_id || null,
        logData.empresa_id || null,
        logData.acao,
        logData.resourse || logData.resource,
        logData.descricao || null,
        JSON.stringify(logData.detalhes) || null
      ];

      console.log('Executando query com valores:', values);

      const [result] = await db.query(query, values);
      console.log('Log criado com sucesso, ID:', result.insertId);

      return this.findById(result.insertId);
    } catch (error) {
      console.error('Erro ao criar log:', error);
      throw error;
    }
  }

  // Atualizar log
  static async update(id, logData) {
    try {
      const query = `
        UPDATE logs 
        SET usuario_id = ?, empresa_id = ?, acao = ?, resourse = ?, descricao = ?, detalhes = ?, updated_at = NOW()
        WHERE id = ?
      `;

      const values = [
        logData.usuario_id || null,
        logData.empresa_id || null,
        logData.acao,
        logData.resourse || logData.resource,
        logData.descricao || null,
        JSON.stringify(logData.detalhes) || null,
        id
      ];

      const [result] = await db.query(query, values);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Erro ao atualizar log:', error);
      throw error;
    }
  }

  // Excluir log
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM logs WHERE id = ?', [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Erro ao excluir log:', error);
      throw error;
    }
  }
}

module.exports = Log;