import pool from '../config/db.js';

class Vaga {
  static async findAll() {
    let client;
    try {
      console.log('Iniciando busca de vagas...');
      client = await pool.connect();
      console.log('Conexão com o banco estabelecida com sucesso para findAll');

      const query = 'SELECT v.*, e.nome as nome_empresa FROM vagas v LEFT JOIN empresas e ON v.empresa_id = e.id ORDER BY v.created_at DESC';
      const result = await client.query(query);

      console.log('Query executada com sucesso para findAll');
      console.log('Número de vagas encontradas:', result.rows.length);

      return result.rows || [];
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      throw error;
    } finally {
      if (client) client.release();
      console.log('Conexão liberada para findAll');
    }
  }

  static async findById(id) {
    let client;
    try {
      client = await pool.connect();
      const query = 'SELECT v.*, e.nome as nome_empresa FROM vagas v LEFT JOIN empresas e ON v.empresa_id = e.id WHERE v.id = $1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar vaga por ID:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async findByEmpresa(empresaId) {
    let client;
    try {
      client = await pool.connect();
      const query = 'SELECT * FROM vagas WHERE empresa_id = $1';
      const result = await client.query(query, [empresaId]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar vagas por empresa:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async create(vagaData) {
    let client;
    try {
      console.log('Dados recebidos para criar vaga:', vagaData);
      client = await pool.connect();

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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
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

      console.log('Executando query de criação com valores:', values);

      const result = await client.query(query, values);
      const newVagaId = result.rows[0].id;
      console.log('Vaga criada com sucesso, ID:', newVagaId);

      // Buscar a vaga criada para retornar com todos os dados (optional, can return just ID)
      const vagaCriadaQuery = 'SELECT v.*, e.nome as nome_empresa FROM vagas v LEFT JOIN empresas e ON v.empresa_id = e.id WHERE v.id = $1';
      const vagaCriadaResult = await client.query(vagaCriadaQuery, [newVagaId]);

      return vagaCriadaResult.rows[0];
    } catch (error) {
      console.error('Erro detalhado ao criar vaga:', {
        message: error.message,
        stack: error.stack,
        data: vagaData
      });
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async update(id, vagaData) {
    let client;
    try {
      client = await pool.connect();
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
        SET nome_vaga = $1, nome_empresa = $2, descricao = $3, tipo_vaga = $4,
            local_vaga = $5, categoria = $6, requisitos = $7, salario = $8
        WHERE id = $9
      `;

      const values = [
        nome_vaga,
        nome_empresa,
        descricao, 
        tipo_vaga,
        local_vaga,
        categoria,
        requisitos,
        salario,
        id
      ];

      console.log('Executando query de atualização com valores:', values);

      const result = await client.query(query, values);

      return result.rowCount > 0; // Return true if a row was updated
    } catch (error) {
      console.error('Erro ao atualizar vaga:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async delete(id) {
    let client;
    try {
      client = await pool.connect();
      const query = 'DELETE FROM vagas WHERE id = $1';
      const result = await client.query(query, [id]);
      return { affectedRows: result.rowCount }; // Return rowCount for affected rows
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }
}

export default Vaga;