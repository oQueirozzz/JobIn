const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Empresa {
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id, nome, email, cnpj, descricao, logo FROM empresas');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id, nome, email, cnpj, descricao, logo FROM empresas WHERE id = ?', 
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM empresas WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(empresaData) {
    try {
      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(empresaData.senha, salt);

      const [result] = await db.query(
        'INSERT INTO empresas (nome, email, cnpj, senha, descricao, logo) VALUES (?, ?, ?, ?, ?, ?)',
        [
          empresaData.nome,
          empresaData.email,
          empresaData.cnpj,
          hashedPassword,
          empresaData.descricao || null,
          empresaData.logo || null
        ]
      );

      return { id: result.insertId, ...empresaData, senha: undefined };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, empresaData) {
    try {
      let query = 'UPDATE empresas SET ';
      const values = [];
      const updateFields = [];

      // Adiciona apenas os campos que foram fornecidos para atualização
      if (empresaData.nome) {
        updateFields.push('nome = ?');
        values.push(empresaData.nome);
      }
      if (empresaData.email) {
        updateFields.push('email = ?');
        values.push(empresaData.email);
      }
      if (empresaData.cnpj) {
        updateFields.push('cnpj = ?');
        values.push(empresaData.cnpj);
      }
      if (empresaData.senha) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(empresaData.senha, salt);
        updateFields.push('senha = ?');
        values.push(hashedPassword);
      }
      if (empresaData.descricao !== undefined) {
        updateFields.push('descricao = ?');
        values.push(empresaData.descricao);
      }
      if (empresaData.logo !== undefined) {
        updateFields.push('logo = ?');
        values.push(empresaData.logo);
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
      const [result] = await db.query('DELETE FROM empresas WHERE id = ?', [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      throw error;
    }
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = Empresa;