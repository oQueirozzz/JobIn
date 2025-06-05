import pool from '../config/db.js';

class Rota {
  // Buscar todas as rotas
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM rotas');
    return rows;
  }

  // Buscar rota por ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM rotas WHERE id = ?', [id]);
    return rows[0];
  }

  // Buscar rotas por criador
  static async findByCreator(createdBy) {
    const [rows] = await pool.query('SELECT * FROM rotas WHERE created_by = ?', [createdBy]);
    return rows;
  }

  // Buscar rotas ativas
  static async findActive() {
    const [rows] = await pool.query('SELECT * FROM rotas WHERE is_active = true');
    return rows;
  }

  // Buscar rotas por dificuldade
  static async findByDifficulty(difficulty) {
    const [rows] = await pool.query('SELECT * FROM rotas WHERE difficulty = ?', [difficulty]);
    return rows;
  }

  // Criar nova rota
  static async create(rotaData) {
    const { name, start_point, end_point, distance, estimated_time, difficulty, created_by } = rotaData;
    const created_at = new Date();
    const is_active = rotaData.is_active !== undefined ? rotaData.is_active : true;
    
    const [result] = await pool.query(
      'INSERT INTO rotas (name, start_point, end_point, distance, estimated_time, difficulty, is_active, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, start_point, end_point, distance, estimated_time, difficulty, is_active, created_by, created_at]
    );
    
    return { id: result.insertId, ...rotaData, created_at };
  }

  // Atualizar rota
  static async update(id, rotaData) {
    const { name, start_point, end_point, distance, estimated_time, difficulty, is_active } = rotaData;
    const updated_at = new Date();
    
    const [result] = await pool.query(
      'UPDATE rotas SET name = ?, start_point = ?, end_point = ?, distance = ?, estimated_time = ?, difficulty = ?, is_active = ?, updated_at = ? WHERE id = ?',
      [name, start_point, end_point, distance, estimated_time, difficulty, is_active, updated_at, id]
    );
    
    return result;
  }

  // Excluir rota
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM rotas WHERE id = ?', [id]);
    return result;
  }

  // Ativar/desativar rota
  static async toggleActive(id, isActive) {
    const updated_at = new Date();
    const [result] = await pool.query(
      'UPDATE rotas SET is_active = ?, updated_at = ? WHERE id = ?',
      [isActive, updated_at, id]
    );
    
    return result;
  }
}

export default Rota;