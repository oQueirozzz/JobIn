const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Usuario {
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id, nome, email, cpf, data_nascimento, habilidades, descricao, formacao, area_interesse, foto, certificados FROM usuarios');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const userId = parseInt(id, 10);
      console.log('Executando findById com ID:', userId);
      console.log('Tipo do ID:', typeof userId);

      if (!userId || isNaN(userId)) {
        console.error('ID inválido:', id);
        return null;
      }

      const [rows] = await db.query(
        'SELECT id, nome, email, cpf, data_nascimento, habilidades, descricao, formacao, area_interesse, foto, certificados FROM usuarios WHERE id = ?', 
        [parseInt(id, 10)]
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
      const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
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

      const [result] = await db.query(
        'INSERT INTO usuarios (nome, email, senha, cpf, data_nascimento, habilidades, descricao, formacao, area_interesse, foto, certificados,tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
        [
          userData.nome,
          userData.email,
          hashedPassword,
          userData.cpf,
          userData.data_nascimento,
          userData.habilidades || null,
          userData.descricao || null,
          userData.formacao || null,
          userData.area_interesse || null,
          userData.foto || null,
          userData.certificados || null,
          userData.tipo
        ]
      );

      

      console.log('Usuário criado com ID:', result.insertId);
      return { id: result.insertId, ...userData, senha: undefined };
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

      // Adiciona todos os campos que estão presentes no userData
      if ('nome' in userData) {
        updateFields.push('nome = ?');
        values.push(userData.nome);
      }
      if ('email' in userData) {
        updateFields.push('email = ?');
        values.push(userData.email);
      }
      if ('senha' in userData && userData.senha) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.senha, salt);
        updateFields.push('senha = ?');
        values.push(hashedPassword);
      }
      if ('cpf' in userData) {
        updateFields.push('cpf = ?');
        values.push(userData.cpf);
      }
      if ('data_nascimento' in userData) {
        updateFields.push('data_nascimento = ?');
        values.push(userData.data_nascimento);
      }
        if (userData.habilidades !== undefined) {
        updateFields.push('habilidades = ?');
        values.push(userData.habilidades);
        }

      if (userData.descricao !== undefined) {
        updateFields.push('descricao = ?');
        values.push(userData.descricao);
      }
      if ('formacao' in userData) {
        updateFields.push('formacao = ?');
        values.push(userData.formacao);
      }
      if ('curriculo' in userData) {
        updateFields.push('curriculo = ?');
        values.push(userData.curriculo);
      }
      if ('area_interesse' in userData) {
        updateFields.push('area_interesse = ?');
        values.push(userData.area_interesse);
      }
      if ('foto' in userData) {
        updateFields.push('foto = ?');
        values.push(userData.foto);
      }
      if ('certificados' in userData) {
        updateFields.push('certificados = ?');
        values.push(userData.certificados);
      }

      console.log('Campos a serem atualizados:', updateFields);
      console.log('Valores a serem atualizados:', values);

      if (updateFields.length === 0) {
        console.log('Nenhum campo para atualizar');
        return { message: 'Nenhum campo para atualizar' };
      }

      query += updateFields.join(', ');
      query += ' WHERE id = ?';
      values.push(id);

      console.log('Query final:', query);
      console.log('Valores finais:', values);

      const [result] = await db.query(query, values);
      console.log('Resultado da query:', result);
      
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Erro detalhado na atualização:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw error;
    }
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = Usuario;