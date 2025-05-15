const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Usuario {
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id, nome, email, cpf, descricao, formacao, area_interesse, foto FROM usuarios');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id, nome, email, cpf, descricao, formacao, area_interesse, foto FROM usuarios WHERE id = ?', 
        [id]
      );
      return rows[0];
    } catch (error) {
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

      const [result] = await db.query(
        'INSERT INTO usuarios (nome, email, senha, cpf, descricao, formacao, curriculo, area_interesse, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          userData.nome,
          userData.email,
          hashedPassword,
          userData.cpf,
          userData.descricao || null,
          userData.formacao || null,
          userData.curriculo || null,
          userData.area_interesse || null,
          userData.foto || null
        ]
      );

      return { id: result.insertId, ...userData, senha: undefined };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      let query = 'UPDATE usuarios SET ';
      const values = [];
      const updateFields = [];

      // Adiciona apenas os campos que foram fornecidos para atualização
      if (userData.nome) {
        updateFields.push('nome = ?');
        values.push(userData.nome);
      }
      if (userData.email) {
        updateFields.push('email = ?');
        values.push(userData.email);
      }
      if (userData.senha) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.senha, salt);
        updateFields.push('senha = ?');
        values.push(hashedPassword);
      }
      if (userData.cpf) {
        updateFields.push('cpf = ?');
        values.push(userData.cpf);
      }
      if (userData.descricao !== undefined) {
        updateFields.push('descricao = ?');
        values.push(userData.descricao);
      }
      if (userData.formacao !== undefined) {
        updateFields.push('formacao = ?');
        values.push(userData.formacao);
      }
      if (userData.curriculo !== undefined) {
        updateFields.push('curriculo = ?');
        values.push(userData.curriculo);
      }
      if (userData.area_interesse !== undefined) {
        updateFields.push('area_interesse = ?');
        values.push(userData.area_interesse);
      }
      if (userData.foto !== undefined) {
        updateFields.push('foto = ?');
        values.push(userData.foto);
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