import pool from '../config/db.js';

class Candidatura {
  static async findAll() {
    let client;
    try {
      client = await pool.connect();
      const query = `SELECT c.*, u.nome as nome_usuario, v.nome_vaga 
                     FROM candidaturas c 
                     JOIN usuarios u ON c.id_usuario = u.id 
                     JOIN vagas v ON c.id_vaga = v.id`;
      const result = await client.query(query);
      return result.rows || [];
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async findById(id) {
    let client;
    try {
      client = await pool.connect();
      const query = `SELECT c.*, u.nome as nome_usuario, v.nome_vaga 
                     FROM candidaturas c 
                     JOIN usuarios u ON c.id_usuario = u.id 
                     JOIN vagas v ON c.id_vaga = v.id 
                     WHERE c.id = $1`;
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar candidatura por ID:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async findByUsuario(usuarioId) {
    let client;
    try {
      client = await pool.connect();
      const query = `SELECT c.*, v.nome_vaga, v.nome_empresa 
                     FROM candidaturas c 
                     JOIN vagas v ON c.id_vaga = v.id 
                     WHERE c.id_usuario = $1`;
      const result = await client.query(query, [usuarioId]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar candidaturas por usuário:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async findByVaga(vagaId) {
    let client;
    try {
      client = await pool.connect();
      const query = `SELECT c.*, u.nome as nome_usuario, u.email, u.data_nascimento, u.foto
                     FROM candidaturas c 
                     JOIN usuarios u ON c.id_usuario = u.id 
                     WHERE c.id_vaga = $1`;
      const result = await client.query(query, [vagaId]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar candidaturas por vaga:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async create(candidaturaData) {
    let client;
    try {
      client = await pool.connect();
      const query = `INSERT INTO candidaturas 
                     (id_usuario, id_vaga, empresa_id, curriculo_usuario) 
                     VALUES ($1, $2, $3, $4) RETURNING id`;
      const values = [
        candidaturaData.id_usuario,
        candidaturaData.id_vaga,
        candidaturaData.empresa_id,
        candidaturaData.curriculo_usuario || null
      ];
      const result = await client.query(query, values);
      const newCandidaturaId = result.rows[0].id;
      return { id: newCandidaturaId, ...candidaturaData };
    } catch (error) {
      console.error('Erro ao criar candidatura:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async update(id, candidaturaData) {
    let client;
    try {
      client = await pool.connect();
      let query = 'UPDATE candidaturas SET ';
      const values = [];
      const updateFields = [];
      let paramCount = 1;

      if (candidaturaData.curriculo_usuario !== undefined) {
        updateFields.push(`curriculo_usuario = $${paramCount++}`);
        values.push(candidaturaData.curriculo_usuario);
      }

      if (candidaturaData.status !== undefined) {
        updateFields.push(`status = $${paramCount++}`);
        values.push(candidaturaData.status);
      }

      if (candidaturaData.empresa_id !== undefined) {
        updateFields.push(`empresa_id = $${paramCount++}`);
        values.push(candidaturaData.empresa_id);
      }

      if (updateFields.length === 0) {
        return { message: 'Nenhum campo para atualizar' };
      }

      query += updateFields.join(', ');
      query += ` WHERE id = $${paramCount++}`;
      values.push(id);

      const result = await client.query(query, values);
      return { affectedRows: result.rowCount };
    } catch (error) {
      console.error('Erro ao atualizar candidatura:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async delete(id) {
    let client;
    try {
      client = await pool.connect();
      const query = 'DELETE FROM candidaturas WHERE id = $1';
      const result = await client.query(query, [id]);
      return { affectedRows: result.rowCount };
    } catch (error) {
      console.error('Erro ao excluir candidatura:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async findByUsuarioEVaga(id_usuario, id_vaga) {
    let client;
    try {
      client = await pool.connect();
      const query = 'SELECT * FROM candidaturas WHERE id_usuario = $1 AND id_vaga = $2';
      const result = await client.query(query, [id_usuario, id_vaga]);
      return result.rows[0]; 
    } catch (error) {
      console.error('Erro ao buscar candidatura por usuário e vaga:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async countCandidaturasByUsuarioEVaga(id_usuario, id_vaga) {
    let client;
    try {
      client = await pool.connect();
      // Contar candidaturas ativas
      const queryActivas = 'SELECT COUNT(*) as total FROM candidaturas WHERE id_usuario = $1 AND id_vaga = $2';
      const resultActivas = await client.query(queryActivas, [id_usuario, id_vaga]);

      // Contar candidaturas removidas (assuming candidaturas_removidas table exists and uses the same structure)
      const queryRemovidas = 'SELECT COUNT(*) as total FROM candidaturas_removidas WHERE id_usuario = $1 AND id_vaga = $2';
      const resultRemovidas = await client.query(queryRemovidas, [id_usuario, id_vaga]);

      // Retornar a soma total
      return (resultActivas.rows[0]?.total || 0) + (resultRemovidas.rows[0]?.total || 0);
    } catch (error) {
      console.error('Erro ao contar candidaturas por usuário e vaga:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }
}

export default Candidatura;
