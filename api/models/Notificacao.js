import pool from '../config/db.js';

class Notificacao {
  // Buscar todas as notificações
  static async findAll() {
    try {
      const { rows } = await pool.query('SELECT * FROM notificacao ORDER BY data_notificacao DESC');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  // Buscar notificação por ID
  static async findById(id) {
    try {
      const { rows } = await pool.query('SELECT * FROM notificacao WHERE id = $1', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar notificação por ID:', error);
      throw error;
    }
  }

  // Buscar notificações por usuário
  static async findByUsuario(usuarioId) {
    try {
      const { rows } = await pool.query('SELECT * FROM notificacao WHERE usuarios_id = $1 ORDER BY data_notificacao DESC', [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações por usuário:', error);
      throw error;
    }
  }

  // Buscar notificações não lidas por usuário
  static async findNaoLidasByUsuario(usuarioId) {
    try {
      const { rows } = await pool.query('SELECT * FROM notificacao WHERE usuarios_id = $1 AND lida = false ORDER BY data_notificacao DESC', [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações não lidas:', error);
      throw error;
    }
  }

  // Buscar notificações por empresa
  static async findByEmpresa(empresaId) {
    try {
      const { rows } = await pool.query('SELECT * FROM notificacao WHERE empresas_id = $1 ORDER BY data_notificacao DESC', [empresaId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar notificações por empresa:', error);
      throw error;
    }
  }

  // Buscar notificações por candidatura
  static async findByCandidatura(candidaturaId) {
    const { rows } = await pool.query('SELECT * FROM notificacao WHERE candidaturas_id = $1 ORDER BY id DESC', [candidaturaId]);
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
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7)
        RETURNING *
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

      const { rows } = await pool.query(query, values);
      console.log('Notificação criada com sucesso, ID:', rows[0].id);

      return rows[0];
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  // Marcar notificação como lida
  static async marcarComoLida(id) {
    try {
      const { rows } = await pool.query('UPDATE notificacao SET lida = true WHERE id = $1 RETURNING *', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  // Marcar todas as notificações do usuário como lidas
  static async marcarTodasComoLidas(usuarioId) {
    const { rows } = await pool.query(
      'UPDATE notificacao SET lida = TRUE WHERE usuarios_id = $1 RETURNING *',
      [usuarioId]
    );
    return rows.length;
  }

  // Atualizar notificação
  static async update(id, notificacaoData) {
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

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Excluir notificação
  static async delete(id) {
    try {
      const { rows } = await pool.query('DELETE FROM notificacao WHERE id = $1 RETURNING *', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
      throw error;
    }
  }
}

export default Notificacao;