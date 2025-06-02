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
        `INSERT INTO candidaturas 
         (id_usuario, id_vaga, empresa_id, curriculo_usuario) 
         VALUES (?, ?, ?, ?)`,
        [
          candidaturaData.id_usuario,
          candidaturaData.id_vaga,
          candidaturaData.empresa_id,
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

      if (candidaturaData.empresa_id !== undefined) {
        updateFields.push('empresa_id = ?');
        values.push(candidaturaData.empresa_id);
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

  static async findByUsuarioEVaga(id_usuario, id_vaga) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM candidaturas WHERE id_usuario = ? AND id_vaga = ?',
      [id_usuario, id_vaga]
    );
    return rows[0]; 
  } catch (error) {
    throw error;
  }
}

static async delete(id) {
  try {
    const [result] = await db.query('DELETE FROM candidaturas WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
}

static async countCandidaturasByUsuarioEVaga(id_usuario, id_vaga) {
  try {
    // Contar candidaturas ativas
    const [candidaturasAtivas] = await db.query(
      'SELECT COUNT(*) as total FROM candidaturas WHERE id_usuario = ? AND id_vaga = ?',
      [id_usuario, id_vaga]
    );

    // Contar candidaturas removidas
    const [candidaturasRemovidas] = await db.query(
      'SELECT COUNT(*) as total FROM candidaturas_removidas WHERE id_usuario = ? AND id_vaga = ?',
      [id_usuario, id_vaga]
    );

    // Retornar a soma total
    return candidaturasAtivas[0].total + candidaturasRemovidas[0].total;
  } catch (error) {
    throw error;
  }
}

}




module.exports = Candidatura;
