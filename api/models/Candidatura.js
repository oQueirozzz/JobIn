const db = require('../config/db');

class Candidatura {
  static async findAll() {
    try {
      const [rows] = await db.query(
        `SELECT c.*, u.nome as nome_usuario, v.nome_vaga 
         FROM candidaturas c 
         JOIN usuarios u ON c.id_usuario = u.id 
         JOIN vagas v ON c.id_vaga = v.id`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(
        `SELECT c.*, u.nome as nome_usuario, v.nome_vaga 
         FROM candidaturas c 
         JOIN usuarios u ON c.id_usuario = u.id 
         JOIN vagas v ON c.id_vaga = v.id 
         WHERE c.id = ?`, 
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUsuario(usuarioId) {
    try {
      const [rows] = await db.query(
        `SELECT c.*, v.nome_vaga, v.nome_empresa 
         FROM candidaturas c 
         JOIN vagas v ON c.id_vaga = v.id 
         WHERE c.id_usuario = ?`, 
        [usuarioId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByVaga(vagaId) {
    try {
      const [rows] = await db.query(
        `SELECT c.*, u.nome as nome_usuario 
         FROM candidaturas c 
         JOIN usuarios u ON c.id_usuario = u.id 
         WHERE c.id_vaga = ?`, 
        [vagaId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(candidaturaData) {
    try {
      const [result] = await db.query(
        'INSERT INTO candidaturas (id_usuario, id_vaga, curriculo_usuario) VALUES (?, ?, ?)',
        [
          candidaturaData.id_usuario,
          candidaturaData.id_vaga,
          candidaturaData.curriculo_usuario || null
        ]
      );

      return { id: result.insertId, ...candidaturaData };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, candidaturaData) {
    try {
      let query = 'UPDATE candidaturas SET ';
      const values = [];
      const updateFields = [];

      if (candidaturaData.curriculo_usuario !== undefined) {
        updateFields.push('curriculo_usuario = ?');
        values.push(candidaturaData.curriculo_usuario);
      }
      
      if (candidaturaData.status !== undefined) {
        updateFields.push('status = ?');
        values.push(candidaturaData.status);
      }

      if (updateFields.length === 0) {
        return { message: 'Nenhum campo para atualizar' };
      }

      query += updateFields.join(', ');
      query += ' WHERE id = ?';
      values.push(id);

      const [result] = await db.query(query, values);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM candidaturas WHERE id = ?', [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Candidatura;