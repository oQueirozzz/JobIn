const pool = require('../config/db');

class Notificacao {
  // Buscar todas as notificações
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM notificacao ORDER BY data_notificacao DESC');
    return rows;
  }

  // Buscar notificação por ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE id = ?', [id]);
    return rows[0];
  }

  // Buscar notificações por usuário
  static async findByUsuario(usuarioId) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE usuarios_id = ? ORDER BY data_notificacao DESC', [usuarioId]);
    return rows;
  }

  // Buscar notificações não lidas por usuário
  static async findNaoLidasByUsuario(usuarioId) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE usuarios_id = ? AND lida = FALSE ORDER BY data_notificacao DESC', [usuarioId]);
    return rows;
  }

  // Buscar notificações por empresa
  static async findByEmpresa(empresaId) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE empresas_id = ? ORDER BY id DESC', [empresaId]);
    return rows;
  }

  // Buscar notificações por candidatura
  static async findByCandidatura(candidaturaId) {
    const [rows] = await pool.query('SELECT * FROM notificacao WHERE candidaturas_id = ? ORDER BY id DESC', [candidaturaId]);
    return rows;
  }

  // Criar nova notificação
  static async create(notificacaoData) {
    try {
      console.log('Dados recebidos para criar notificação:', notificacaoData);
      
      const { candidaturas_id, empresas_id, usuarios_id, mensagem_usuario, mensagem_empresa, status_candidatura } = notificacaoData;
      
      // Validação dos dados
      if (!usuarios_id || !candidaturas_id || !empresas_id) {
        throw new Error('Dados incompletos para criar notificação');
      }

      // Verificar se o usuário existe
      const [usuario] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuarios_id]);
      if (!usuario || usuario.length === 0) {
        throw new Error(`Usuário com ID ${usuarios_id} não encontrado`);
      }

      // Criar a notificação
      const [result] = await pool.query(
        'INSERT INTO notificacao (candidaturas_id, empresas_id, usuarios_id, mensagem_usuario, mensagem_empresa, status_candidatura) VALUES (?, ?, ?, ?, ?, ?)',
        [candidaturas_id, empresas_id, usuarios_id, mensagem_usuario, mensagem_empresa, status_candidatura]
      );
      
      console.log('Notificação criada com sucesso:', { id: result.insertId, ...notificacaoData });
      
      return { id: result.insertId, ...notificacaoData };
    } catch (error) {
      console.error('Erro ao criar notificação:', {
        error: error.message,
        data: notificacaoData
      });
      throw error;
    }
  }

  // Marcar notificação como lida
  static async marcarComoLida(id) {
    const [result] = await pool.query(
      'UPDATE notificacao SET lida = TRUE WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Marcar todas as notificações do usuário como lidas
  static async marcarTodasComoLidas(usuarioId) {
    const [result] = await pool.query(
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

    const [result] = await pool.query(query, values);
    return { affectedRows: result.affectedRows };
  }

  // Excluir notificação
  static async delete(id) {
    const query = 'DELETE FROM notificacao WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result;
  }
}

module.exports = Notificacao;