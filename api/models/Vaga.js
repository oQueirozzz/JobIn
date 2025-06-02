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
      console.log('Dados recebidos para criar vaga:', vagaData);
      
      const { 
        empresa_id, 
        nome_vaga, 
        nome_empresa, 
        descricao, 
        salario, 
        local_vaga, 
        tipo_vaga, 
        categoria
      } = vagaData;

      // Validar campos obrigatórios
      if (!empresa_id || !nome_vaga || !nome_empresa) {
        throw new Error('Campos obrigatórios faltando: empresa_id, nome_vaga, nome_empresa');
      }
      
      const query = `
        INSERT INTO vagas (
          empresa_id, nome_vaga, nome_empresa, descricao, 
          salario, local_vaga, tipo_vaga, categoria, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,  'aberta')
      `;
      
      const values = [
        empresa_id, 
        nome_vaga, 
        nome_empresa, 
        descricao || null, 
        salario || null, 
        local_vaga || null, 
        tipo_vaga || null, 
        categoria || null
      ];

      console.log('Executando query com valores:', values);

      const [result] = await db.query(query, values);
      console.log('Vaga criada com sucesso, ID:', result.insertId);

      // Buscar a vaga criada para retornar com todos os dados
      const [vagaCriada] = await db.query(
        'SELECT v.*, e.nome as nome_empresa FROM vagas v LEFT JOIN empresas e ON v.empresa_id = e.id WHERE v.id = ?',
        [result.insertId]
      );

      return vagaCriada[0];
    } catch (error) {
      console.error('Erro detalhado ao criar vaga:', {
        message: error.message,
        stack: error.stack,
        data: vagaData
      });
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