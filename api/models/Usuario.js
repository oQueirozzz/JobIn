import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class Usuario {
  static async findAll() {
    try {
      const { rows } = await pool.query('SELECT id, nome, email, cpf, data_nascimento, habilidades, descricao, formacao, area_interesse, tipo, certificados, curriculo FROM usuarios');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id, includePassword = false) {
    try {
      const userId = parseInt(id, 10);
      console.log('Executando findById com ID:', userId);
      console.log('Tipo do ID:', typeof userId);

      if (!userId || isNaN(userId)) {
        console.error('ID inválido:', id);
        return null;
      }

      let queryText = 'SELECT id, nome, email, cpf, data_nascimento, habilidades, descricao, formacao, area_interesse, tipo, certificados, curriculo';
      if (includePassword) {
        queryText += ', senha'; // Adiciona a senha se solicitado
      }
      queryText += ' FROM usuarios WHERE id = $1';

      const { rows } = await pool.query(
        queryText, 
        [userId]
      );
      console.log('Resultado da consulta:', rows);
      return rows[0];
    } catch (error) {
      console.error('Erro em findById:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { rows } = await pool.query(
        'SELECT id, nome, email, senha, cpf, data_nascimento, habilidades, descricao, formacao, curriculo, area_interesse, tipo, certificados FROM usuarios WHERE email = $1',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  static async findByCPF(cpf) {
    try {
      const { rows } = await pool.query('SELECT * FROM usuarios WHERE cpf = $1', [cpf]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por CPF:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.senha, salt);

      // Log para debug
      console.log('Criando usuário com dados:', {
        ...userData,
        senha: '[PROTEGIDA]'
      });

      // Campos obrigatórios
      const camposObrigatorios = {
        nome: userData.nome,
        email: userData.email,
        senha: hashedPassword,
        cpf: userData.cpf,
        data_nascimento: userData.data_nascimento,
        tipo: userData.tipo || 'usuario'
      };

      // Campos opcionais
      const camposOpcionais = {
        habilidades: userData.habilidades || null,
        descricao: userData.descricao || null,
        formacao: userData.formacao || null,
        curriculo: userData.curriculo || null,
        area_interesse: userData.area_interesse || null,
        certificados: userData.certificados || null
      };

      // Construir a query dinamicamente
      const campos = [...Object.keys(camposObrigatorios), ...Object.keys(camposOpcionais)];
      const valores = [...Object.values(camposObrigatorios), ...Object.values(camposOpcionais)];
      const placeholders = valores.map((_, index) => `$${index + 1}`).join(', ');

      const query = `
        INSERT INTO usuarios (${campos.join(', ')})
        VALUES (${placeholders})
        RETURNING id, nome, email, cpf, data_nascimento, habilidades, descricao, formacao, curriculo, area_interesse, tipo, certificados
      `;

      console.log('Query de criação:', query);
      console.log('Valores:', valores);

      const { rows } = await pool.query(query, valores);

      if (!rows[0]) {
        throw new Error('Falha ao criar usuário no banco de dados');
      }

      console.log('Usuário criado com ID:', rows[0].id);
      return rows[0];
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      console.log('Iniciando atualização no modelo com ID:', id);
      console.log('Dados recebidos para atualização:', userData);

      let query = 'UPDATE usuarios SET ';
      const values = [];
      const updateFields = [];
      let paramCount = 1;

      // Adiciona todos os campos que estão presentes no userData
      if ('nome' in userData) {
        updateFields.push(`nome = $${paramCount}`);
        values.push(userData.nome);
        paramCount++;
      }
      if ('email' in userData) {
        updateFields.push(`email = $${paramCount}`);
        values.push(userData.email);
        paramCount++;
      }
      if ('senha' in userData && userData.senha) {
        // A senha já deve vir hasheada do controlador quando for uma atualização
        // Não hashear novamente aqui para evitar hash duplo.
        updateFields.push(`senha = $${paramCount}`);
        values.push(userData.senha); // Usar a senha já hasheada
        paramCount++;
      }
      if ('cpf' in userData) {
        updateFields.push(`cpf = $${paramCount}`);
        values.push(userData.cpf);
        paramCount++;
      }
      if ('data_nascimento' in userData) {
        updateFields.push(`data_nascimento = $${paramCount}`);
        values.push(userData.data_nascimento);
        paramCount++;
      }
      if (userData.habilidades !== undefined) {
        updateFields.push(`habilidades = $${paramCount}`);
        values.push(userData.habilidades);
        paramCount++;
      }
      if (userData.descricao !== undefined) {
        updateFields.push(`descricao = $${paramCount}`);
        values.push(userData.descricao);
        paramCount++;
      }
      if ('formacao' in userData) {
        updateFields.push(`formacao = $${paramCount}`);
        values.push(userData.formacao);
        paramCount++;
      }
      if ('curriculo' in userData) {
        updateFields.push(`curriculo = $${paramCount}`);
        values.push(userData.curriculo);
        paramCount++;
      }
      if ('area_interesse' in userData) {
        updateFields.push(`area_interesse = $${paramCount}`);
        values.push(userData.area_interesse);
        paramCount++;
      }
      if ('tipo' in userData) {
        updateFields.push(`tipo = $${paramCount}`);
        values.push(userData.tipo);
        paramCount++;
      }

      if ('certificados' in userData) {
        updateFields.push(`certificados = $${paramCount}`);
        values.push(userData.certificados);
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
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Primeiro verifica se o usuário existe
      const checkResult = await client.query('SELECT id FROM usuarios WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      // Executa a exclusão
      const { rows } = await client.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
      
      await client.query('COMMIT');
      return rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao deletar usuário:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Erro ao comparar senha:', error);
      throw error;
    }
  }
}

export default Usuario;