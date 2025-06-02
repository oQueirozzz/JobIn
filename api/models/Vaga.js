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
      const { 
        empresa_id, 
        nome_vaga, 
        nome_empresa, 
        descricao, 
        requisitos, 
        salario, 
        local_vaga, 
        tipo_vaga, 
        categoria
      } = vagaData;
      
      const query = `
        INSERT INTO vagas (
          empresa_id, nome_vaga, nome_empresa, descricao, requisitos, 
          salario, local_vaga, tipo_vaga, categoria
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        empresa_id, 
        nome_vaga, 
        nome_empresa, 
        descricao || null, 
        requisitos || null,
        salario || null, 
        local_vaga || null, 
        tipo_vaga || null, 
        categoria || null
      ]);

      // Buscar a vaga criada para retornar com todos os dados
      const [vagaCriada] = await db.query(
        'SELECT v.*, e.nome as nome_empresa FROM vagas v LEFT JOIN empresas e ON v.empresa_id = e.id WHERE v.id = ?',
        [result.insertId]
      );

      return vagaCriada[0];
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      throw error;
    }
  }

  static async update(id, vagaData) {
    try {
      const { nome_vaga, descricao, requisitos, salario, local_vaga, tipo_vaga, status } = vagaData;
      
      const query = `
        UPDATE vagas 
        SET nome_vaga = ?, descricao = ?, requisitos = ?,
            salario = ?, local_vaga = ?, tipo_vaga = ?, status = ?
        WHERE id = ?
      `;
      
      const [result] = await db.execute(query, [
        nome_vaga, descricao, requisitos,
        salario, local_vaga, tipo_vaga, status || 'aberta', id
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar vaga:', error);
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