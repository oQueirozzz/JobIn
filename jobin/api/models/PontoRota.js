const pool = require('../config/db');

class PontoRota {
  // Buscar todos os pontos de rotas
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM pontos_rotas');
    return rows;
  }

  // Buscar ponto de rota por ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM pontos_rotas WHERE id = ?', [id]);
    return rows[0];
  }

  // Buscar pontos de uma rota específica
  static async findByRouteId(routeId) {
    const [rows] = await pool.query('SELECT * FROM pontos_rotas WHERE route_id = ? ORDER BY sequence ASC', [routeId]);
    return rows;
  }

  // Criar novo ponto de rota
  static async create(pontoData) {
    const { route_id, sequence, latitude, longitude, description } = pontoData;
    
    const [result] = await pool.query(
      'INSERT INTO pontos_rotas (route_id, sequence, latitude, longitude, description) VALUES (?, ?, ?, ?, ?)',
      [route_id, sequence, latitude, longitude, description]
    );
    
    return { id: result.insertId, ...pontoData };
  }

  // Criar múltiplos pontos de rota
  static async createMany(routeId, pontos) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const results = [];
      for (const ponto of pontos) {
        const { sequence, latitude, longitude, description } = ponto;
        const [result] = await connection.query(
          'INSERT INTO pontos_rotas (route_id, sequence, latitude, longitude, description) VALUES (?, ?, ?, ?, ?)',
          [routeId, sequence, latitude, longitude, description]
        );
        results.push({ id: result.insertId, route_id: routeId, ...ponto });
      }
      
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Atualizar ponto de rota
  static async update(id, pontoData) {
    const { sequence, latitude, longitude, description } = pontoData;
    
    const [result] = await pool.query(
      'UPDATE pontos_rotas SET sequence = ?, latitude = ?, longitude = ?, description = ? WHERE id = ?',
      [sequence, latitude, longitude, description, id]
    );
    
    return result;
  }

  // Excluir ponto de rota
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM pontos_rotas WHERE id = ?', [id]);
    return result;
  }

  // Excluir todos os pontos de uma rota
  static async deleteByRouteId(routeId) {
    const [result] = await pool.query('DELETE FROM pontos_rotas WHERE route_id = ?', [routeId]);
    return result;
  }
}

module.exports = PontoRota;