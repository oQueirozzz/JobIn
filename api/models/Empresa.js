const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Empresa {
  static async findAll() {
    try {
      console.log('Iniciando busca de empresas...');
      const [rows] = await db.execute('SELECT id, nome, email, cnpj, descricao, local, tipo, logo FROM empresas');
      console.log('Número de empresas encontradas:', rows.length);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT id, nome, email, cnpj, descricao, local, tipo, logo FROM empresas WHERE id = ?', 
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
      const [rows] = await db.execute('SELECT * FROM empresas WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar empresa por email:', error);
      throw error;
    }
  }

  static async findByCNPJ(cnpj) {
    try {
      const [rows] = await db.execute('SELECT * FROM empresas WHERE cnpj = ?', [cnpj]);
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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

      const [result] = await db.execute(query, values);
      console.log('Empresa inserida com sucesso, ID:', result.insertId);

      // Buscar a empresa recém-criada
      const novaEmpresa = await this.findById(result.insertId);
      if (!novaEmpresa) {
        throw new Error('Erro ao recuperar empresa após criação');
      }

      return novaEmpresa;
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

      // Adiciona apenas os campos que foram fornecidos para atualização
      if (empresaData.nome) {
        updateFields.push('nome = ?');
        values.push(empresaData.nome);
      }
      if (empresaData.email) {
        updateFields.push('email = ?');
        values.push(empresaData.email.toLowerCase());
      }
      if (empresaData.cnpj) {
        updateFields.push('cnpj = ?');
        values.push(empresaData.cnpj.replace(/\D/g, ''));
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
      if (empresaData.local !== undefined) {
        updateFields.push('local = ?');
        values.push(empresaData.local);
      }
      if (empresaData.tipo !== undefined) {
        updateFields.push('tipo = ?');
        values.push(empresaData.tipo);
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

      const [result] = await db.execute(query, values);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM empresas WHERE id = ?', [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      throw error;
    }
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = Empresa;