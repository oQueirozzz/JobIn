const db = require('../config/db');

class Vaga {
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT v.*, e.nome as nome_empresa FROM vagas v LEFT JOIN empresas e ON v.empresa_id = e.id'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT v.*, e.nome as nome_empresa FROM vagas v LEFT JOIN empresas e ON v.empresa_id = e.id WHERE v.id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmpresa(empresaId) {
    try {
      const [rows] = await db.query('SELECT * FROM vagas WHERE empresa_id = ?', [empresaId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(vagaData) {
    try {
      const [result] = await db.query(
        'INSERT INTO vagas (empresa_id, nome_vaga, nome_empresa, descricao, tipo_vaga, local_vaga, categoria, salario) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
        [
          vagaData.empresa_id,
          vagaData.nome_vaga,
          vagaData.nome_empresa,
          vagaData.descricao || null,
          vagaData.tipo_vaga || null,
          vagaData.local_vaga || null,
          vagaData.categoria || null,
          vagaData.salario || null
        ]
      );

      return { id: result.insertId, ...vagaData };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, vagaData) {
    try {
      let query = 'UPDATE vagas SET ';
      const values = [];
      const updateFields = [];

      // Adiciona apenas os campos que foram fornecidos para atualização
      if (vagaData.empresa_id) {
        updateFields.push('empresa_id = ?');
        values.push(vagaData.empresa_id);
      }
      if (vagaData.nome_vaga) {
        updateFields.push('nome_vaga = ?');
        values.push(vagaData.nome_vaga);
      }
      if (vagaData.nome_empresa) {
        updateFields.push('nome_empresa = ?');
        values.push(vagaData.nome_empresa);
      }
      if (vagaData.descricao !== undefined) {
        updateFields.push('descricao = ?');
        values.push(vagaData.descricao);
      }
      if (vagaData.tipo_vaga !== undefined) {
        updateFields.push('tipo_vaga = ?');
        values.push(vagaData.tipo_vaga);
      }
      if (vagaData.local_vaga !== undefined) {
        updateFields.push('local_vaga = ?');
        values.push(vagaData.local_vaga);
      }
      if (vagaData.categoria !== undefined) {
        updateFields.push('categoria = ?');
        values.push(vagaData.categoria);
      }

      if (updateFields.length === 0) {
        return { message: 'Nenhum campo para atualizar' };
      }

      if (vagaData.salario !== undefined) {
        updateFields.push('salario = ?');
        values.push(vagaData.salario);
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
      const [result] = await db.query('DELETE FROM vagas WHERE id = ?', [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Vaga;