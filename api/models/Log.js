import pool from '../config/db.js';

class Log {
  // Buscar todos os logs
  static async findAll() {
    try {
      const { rows } = await pool.query('SELECT * FROM logs ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      throw error;
    }
  }

  // Buscar log por ID
  static async findById(id) {
    try {
      const { rows } = await pool.query('SELECT * FROM logs WHERE id = $1', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar log por ID:', error);
      throw error;
    }
  }

  // Buscar logs por usuário
  static async findByUsuario(usuarioId) {
    try {
      const { rows } = await pool.query('SELECT * FROM logs WHERE usuario_id = $1 ORDER BY created_at DESC', [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar logs por usuário:', error);
      throw error;
    }
  }

  // Buscar logs por empresa
  static async findByEmpresa(empresaId) {
    try {
      const { rows } = await pool.query('SELECT * FROM logs WHERE empresa_id = $1 ORDER BY created_at DESC', [empresaId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar logs por empresa:', error);
      throw error;
    }
  }

  // Buscar logs por ação
  static async findByAcao(acao) {
    try {
      const { rows } = await pool.query('SELECT * FROM logs WHERE acao = $1 ORDER BY created_at DESC', [acao]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar logs por ação:', error);
      throw error;
    }
  }

  // Criar novo log
  static async create(logData) {
    let client;
    try {
      client = await pool.connect();
      console.log('Criando log com dados:', logData);

      const query = `
        INSERT INTO logs (
          usuario_id,
          empresa_id,
          tipo_acao,
          tipo_entidade,
          descricao,
          dados_adicionais,
          data_criacao
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING *
      `;

      const values = [
        logData.usuario_id || null,
        logData.empresa_id || null,
        logData.tipo_acao || null,
        logData.tipo_entidade || null,
        logData.descricao || null,
        logData.dados_adicionais ? JSON.stringify(logData.dados_adicionais) : null
      ];

      console.log('Executando query com valores:', values);

      const { rows } = await client.query(query, values);
      console.log('Log criado com sucesso, ID:', rows[0].id);

      return rows[0];
    } catch (error) {
      console.error('Erro ao criar log:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Atualizar log
  static async update(id, logData) {
    try {
      const query = `
        UPDATE logs 
        SET usuario_id = $1, 
            empresa_id = $2, 
            tipo_acao = $3, 
            tipo_entidade = $4, 
            descricao = $5, 
            dados_adicionais = $6, 
            data_atualizacao = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `;

      const values = [
        logData.usuario_id || null,
        logData.empresa_id || null,
        logData.tipo_acao || null,
        logData.tipo_entidade || null,
        logData.descricao || null,
        logData.dados_adicionais ? JSON.stringify(logData.dados_adicionais) : null,
        id
      ];

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao atualizar log:', error);
      throw error;
    }
  }

  // Excluir log
  static async delete(id) {
    try {
      const { rows } = await pool.query('DELETE FROM logs WHERE id = $1 RETURNING *', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao excluir log:', error);
      throw error;
    }
  }
}

export default Log;