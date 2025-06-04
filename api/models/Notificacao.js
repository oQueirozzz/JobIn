const db = require('../config/db.js');

class Notificacao {
  // Buscar todas as notificações
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM notificacao ORDER BY data_notificacao DESC');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  // Buscar notificação por ID
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM notificacao WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar notificação por ID:', error);
      throw error;
    }
  }

  // Buscar notificações por usuário
  static async findByUsuario(usuarioId) {
    try {
      const [rows] = await db.query('SELECT * FROM notificacao WHERE usuarios_id = ? ORDER BY data_notificacao DESC', [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações por usuário:', error);
      throw error;
    }
  }

  // Buscar notificações não lidas por usuário
  static async findNaoLidasByUsuario(usuarioId) {
    try {
      const [rows] = await db.query('SELECT * FROM notificacao WHERE usuarios_id = ? AND lida = 0 ORDER BY data_notificacao DESC', [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações não lidas:', error);
      throw error;
    }
  }

  // Buscar notificações por empresa
  static async findByEmpresa(empresaId) {
    try {
      const [rows] = await db.query('SELECT * FROM notificacao WHERE empresas_id = ? ORDER BY data_notificacao DESC', [empresaId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações por empresa:', error);
      throw error;
    }
  }

  // Buscar notificações por candidatura
  static async findByCandidatura(candidaturaId) {
    const [rows] = await db.query('SELECT * FROM notificacao WHERE candidaturas_id = ? ORDER BY id DESC', [candidaturaId]);
    return rows;
  }

  // Criar nova notificação
  static async create(notificacaoData) {
    try {
      console.log('Criando notificação com dados:', notificacaoData);

      const query = `
        INSERT INTO notificacao (
          candidaturas_id,
          empresas_id,
          usuarios_id,
          mensagem_usuario,
          mensagem_empresa,
          status_candidatura,
          data_notificacao,
          lida
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
      `;

      const values = [
        notificacaoData.candidaturas_id || 0,
        notificacaoData.empresas_id || null,
        notificacaoData.usuarios_id || null,
        notificacaoData.mensagem_usuario || null,
        notificacaoData.mensagem_empresa || null,
        notificacaoData.status_candidatura || null,
        notificacaoData.lida || false
      ];

      console.log('Executando query com valores:', values);

      const [result] = await db.query(query, values);
      console.log('Notificação criada com sucesso, ID:', result.insertId);

      return this.findById(result.insertId);
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  // Marcar notificação como lida
  static async marcarComoLida(id) {
    try {
      const [result] = await db.query('UPDATE notificacao SET lida = true WHERE id = ?', [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  // Marcar todas as notificações do usuário como lidas
  static async marcarTodasComoLidas(usuarioId) {
    const [result] = await db.query(
      'UPDATE notificacao SET lida = TRUE WHERE usuarios_id = ?',
      [usuarioId]
    );
    return result.affectedRows;
  }

  // Atualizar notificação
  static async update(id, notificacaoData) {
    const { mensagem_usuario, mensagem_empresa, status_candidatura } = notificacaoData;
    
    let query = 'UPDATE notificacao SET ';
    const values = [];
    const updateFields = [];

    if (mensagem_usuario !== undefined) {
      updateFields.push('mensagem_usuario = ?');
      values.push(mensagem_usuario);
    }

    if (mensagem_empresa !== undefined) {
      updateFields.push('mensagem_empresa = ?');
      values.push(mensagem_empresa);
    }

    if (status_candidatura !== undefined) {
      updateFields.push('status_candidatura = ?');
      values.push(status_candidatura);
    }

    if (updateFields.length === 0) {
      return { message: 'Nenhum campo para atualizar' };
    }

    query += updateFields.join(', ');
    query += ' WHERE id = ?';
    values.push(id);

    const [result] = await db.query(query, values);
    return { affectedRows: result.affectedRows };
  }

  // Excluir notificação
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM notificacao WHERE id = ?', [id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
      throw error;
    }
  }
}

module.exports = Notificacao;