import pool from '../config/db.js';

class Vaga {
  static async findAll() {
    try {
      console.log('Iniciando busca de vagas...');
      
      // Testar a conexão antes de executar a query
      const connection = await db.getConnection();
      console.log('Conexão com o banco estabelecida com sucesso');
      
      try {
        const [rows] = await connection.execute(
          'SELECT v.*, e.nome as nome_empresa FROM vagas v LEFT JOIN empresas e ON v.empresa_id = e.id ORDER BY v.created_at DESC'
        );
        console.log('Query executada com sucesso');
        console.log('Número de vagas encontradas:', rows.length);
        console.log('Primeira vaga (se houver):', rows[0]);
        
        // Garantir que sempre retornamos um array
        const resultado = Array.isArray(rows) ? rows : [];
        console.log('Resultado final:', resultado);
        
        return resultado;
      } finally {
        connection.release();
        console.log('Conexão liberada');
      }
    } catch (error) {
      console.error('Erro detalhado ao buscar vagas:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      });
      return [];
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
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
      const [rows] = await db.execute('SELECT * FROM vagas WHERE empresa_id = ?', [empresaId]);
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
        tipo_vaga,
        local_vaga,
        categoria,
        requisitos,
        salario
      } = vagaData;

      // Validar campos obrigatórios
      if (!empresa_id || !nome_vaga || !nome_empresa || !descricao || !tipo_vaga || !local_vaga || !categoria || !requisitos) {
        throw new Error('Campos obrigatórios faltando: empresa_id, nome_vaga, nome_empresa, descricao, tipo_vaga, local_vaga, categoria e requisitos');
      }
      
      const query = `
        INSERT INTO vagas (
          empresa_id, nome_vaga, nome_empresa, descricao, tipo_vaga,
          local_vaga, categoria, requisitos, salario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        empresa_id, 
        nome_vaga,
        nome_empresa,
        descricao, 
        tipo_vaga,
        local_vaga,
        categoria,
        requisitos,
        salario || null
      ];

      console.log('Executando query com valores:', values);

      const [result] = await db.execute(query, values);
      console.log('Vaga criada com sucesso, ID:', result.insertId);

      // Buscar a vaga criada para retornar com todos os dados
      const [vagaCriada] = await db.execute(
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
      const { 
        nome_vaga,
        nome_empresa,
        descricao, 
        tipo_vaga,
        local_vaga,
        categoria,
        requisitos,
        salario
      } = vagaData;
      
      const query = `
        UPDATE vagas 
        SET nome_vaga = ?, nome_empresa = ?, descricao = ?, tipo_vaga = ?,
            local_vaga = ?, categoria = ?, requisitos = ?, salario = ?
        WHERE id = ?
      `;
      
      const [result] = await db.execute(query, [
        nome_vaga,
        nome_empresa,
        descricao, 
        tipo_vaga,
        local_vaga,
        categoria,
        requisitos,
        salario,
        id
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar vaga:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM vagas WHERE id = ?', [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw error;
    }
  }
}

export default Vaga;