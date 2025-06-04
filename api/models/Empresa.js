import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class Empresa {
  static async findAll() {
    try {
      console.log('Iniciando busca de empresas...');
      const { rows } = await pool.query('SELECT id, nome, email, cnpj, descricao, local, tipo, logo FROM empresas');
      console.log('Número de empresas encontradas:', rows.length);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { rows } = await pool.query(
        'SELECT id, nome, email, cnpj, descricao, local, tipo, logo FROM empresas WHERE id = $1', 
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar empresa por ID:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { rows } = await pool.query('SELECT * FROM empresas WHERE email = $1', [email]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar empresa por email:', error);
      throw error;
    }
  }

  static async findByCNPJ(cnpj) {
    try {
      const { rows } = await pool.query('SELECT * FROM empresas WHERE cnpj = $1', [cnpj]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar empresa por CNPJ:', error);
      throw error;
    }
  }

  static async create(empresaData) {
    try {
      console.log('Iniciando criação de empresa com dados:', {
        ...empresaData,
        senha: '[REDACTED]'
      });

      // Validar campos obrigatórios
      if (!empresaData.nome || !empresaData.email || !empresaData.senha || !empresaData.cnpj) {
        throw new Error('Campos obrigatórios faltando');
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(empresaData.senha, salt);
      console.log('Senha hasheada com sucesso');

      const query = `
        INSERT INTO empresas (nome, email, cnpj, senha, descricao, local, tipo, logo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        empresaData.nome,
        empresaData.email.toLowerCase(), // Converter email para minúsculo
        empresaData.cnpj.replace(/\D/g, ''), // Remover caracteres não numéricos do CNPJ
        hashedPassword,
        empresaData.descricao || '',
        empresaData.local || '',
        empresaData.tipo || 'empresa',
        empresaData.logo || ''
      ];

      console.log('Executando query com valores:', {
        ...values,
        senha: '[REDACTED]'
      });

      const { rows } = await pool.query(query, values);
      console.log('Empresa inserida com sucesso, ID:', rows[0].id);

      return rows[0];
    } catch (error) {
      console.error('Erro detalhado ao criar empresa:', {
        message: error.message,
        stack: error.stack,
        data: {
          ...empresaData,
          senha: '[REDACTED]'
        }
      });
      throw error;
    }
  }

  static async update(id, empresaData) {
    try {
      let query = 'UPDATE empresas SET ';
      const values = [];
      const updateFields = [];
      let paramCount = 1;

      // Adiciona apenas os campos que foram fornecidos para atualização
      if (empresaData.nome) {
        updateFields.push(`nome = $${paramCount}`);
        values.push(empresaData.nome);
        paramCount++;
      }
      if (empresaData.email) {
        updateFields.push(`email = $${paramCount}`);
        values.push(empresaData.email.toLowerCase());
        paramCount++;
      }
      if (empresaData.cnpj) {
        updateFields.push(`cnpj = $${paramCount}`);
        values.push(empresaData.cnpj.replace(/\D/g, ''));
        paramCount++;
      }
      if (empresaData.senha) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(empresaData.senha, salt);
        updateFields.push(`senha = $${paramCount}`);
        values.push(hashedPassword);
        paramCount++;
      }
      if (empresaData.descricao !== undefined) {
        updateFields.push(`descricao = $${paramCount}`);
        values.push(empresaData.descricao);
        paramCount++;
      }
      if (empresaData.local !== undefined) {
        updateFields.push(`local = $${paramCount}`);
        values.push(empresaData.local);
        paramCount++;
      }
      if (empresaData.tipo !== undefined) {
        updateFields.push(`tipo = $${paramCount}`);
        values.push(empresaData.tipo);
        paramCount++;
      }
      if (empresaData.logo !== undefined) {
        updateFields.push(`logo = $${paramCount}`);
        values.push(empresaData.logo);
        paramCount++;
      }

      if (updateFields.length === 0) {
        return { message: 'Nenhum campo para atualizar' };
      }

      query += updateFields.join(', ');
      query += ` WHERE id = $${paramCount} RETURNING *`;
      values.push(id);

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { rows } = await pool.query('DELETE FROM empresas WHERE id = $1 RETURNING *', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      throw error;
    }
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export default Empresa;