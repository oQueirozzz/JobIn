import pool from '../config/db.js';

class Notificacao {
  // Buscar todas as notificações
  static async findAll() {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM notificacao ORDER BY data_notificacao DESC');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Buscar notificação por ID
  static async findById(id) {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM notificacao WHERE id = $1', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar notificação por ID:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Buscar notificações por usuário
  static async findByUsuario(usuarioId) {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM notificacao WHERE usuario_id = $1 ORDER BY data_notificacao DESC', [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações por usuário:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Buscar notificações não lidas por usuário
  static async findNaoLidasByUsuario(usuarioId) {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM notificacao WHERE usuario_id = $1 AND lida = false ORDER BY data_notificacao DESC', [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações não lidas:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Buscar notificações por empresa
  static async findByEmpresa(empresaId) {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM notificacao WHERE empresa_id = $1 ORDER BY data_notificacao DESC', [empresaId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações por empresa:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Buscar notificações por candidatura
  static async findByCandidatura(candidaturaId) {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM notificacao WHERE candidaturas_id = $1 ORDER BY id DESC', [candidaturaId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações por candidatura:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Criar nova notificação
  static async create(notificacaoData) {
    const { usuario_id, empresa_id, candidaturas_id, mensagem_usuario, mensagem_empresa, tipo, status_candidatura, lida } = notificacaoData;
    
    const query = `
      INSERT INTO notificacao (usuario_id, empresa_id, candidaturas_id, mensagem_usuario, mensagem_empresa, tipo, status_candidatura, lida)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [usuario_id, empresa_id, candidaturas_id, mensagem_usuario, mensagem_empresa, tipo, status_candidatura, lida];
    
    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Marcar notificação como lida
  static async marcarComoLida(notificacaoId) {
    const query = `
      UPDATE notificacao
      SET lida = true
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const { rows } = await pool.query(query, [notificacaoId]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Marcar todas as notificações do usuário como lidas
  static async marcarTodasComoLidas(usuarioId) {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(
        'UPDATE notificacao SET lida = TRUE WHERE usuario_id = $1 RETURNING *',
        [usuarioId]
      );
      return rows.length;
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Atualizar notificação
  static async update(id, notificacaoData) {
    let client;
    try {
      client = await pool.connect();
      const { mensagem_usuario, mensagem_empresa, status_candidatura } = notificacaoData;

      let query = 'UPDATE notificacao SET ';
      const values = [];
      const updateFields = [];
      let paramCount = 1;

      if (mensagem_usuario !== undefined) {
        updateFields.push(`mensagem_usuario = $${paramCount}`);
        values.push(mensagem_usuario);
        paramCount++;
      }

      if (mensagem_empresa !== undefined) {
        updateFields.push(`mensagem_empresa = $${paramCount}`);
        values.push(mensagem_empresa);
        paramCount++;
      }

      if (status_candidatura !== undefined) {
        updateFields.push(`status_candidatura = $${paramCount}`);
        values.push(status_candidatura);
        paramCount++;
      }

      if (updateFields.length === 0) {
        return { message: 'Nenhum campo para atualizar' };
      }

      query += updateFields.join(', ');
      query += ` WHERE id = $${paramCount} RETURNING *`;
      values.push(id);

      const { rows } = await client.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  // Excluir notificação
  static async delete(id) {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query('DELETE FROM notificacao WHERE id = $1 RETURNING *', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  static async getNotificacoesNaoLidas(usuarioId) {
    const query = `
      SELECT n.*, 
             CASE 
                 WHEN n.remetente_tipo = 'user' THEN u.nome
                 WHEN n.remetente_tipo = 'company' THEN e.nome
             END as remetente_nome,
             CASE 
                 WHEN n.remetente_tipo = 'user' THEN u.foto
                 WHEN n.remetente_tipo = 'company' THEN e.logo
             END as remetente_imagem
      FROM notificacao n
      LEFT JOIN usuarios u ON n.remetente_id = u.id AND n.remetente_tipo = 'user'
      LEFT JOIN empresas e ON n.remetente_id = e.id AND n.remetente_tipo = 'company'
      WHERE n.usuario_id = $1 AND n.lida = false
      ORDER BY n.data_notificacao DESC
    `;

    try {
      const { rows } = await pool.query(query, [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  static async deleteByEmpresaId(empresaId) {
    let client;
    try {
      client = await pool.connect();
      await client.query('DELETE FROM notificacao WHERE empresa_id = $1', [empresaId]);
    } catch (error) {
      console.error('Erro ao excluir notificações da empresa:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }
}

export default Notificacao;