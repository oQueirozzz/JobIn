import { pool } from '../config/database.js';

export default class BaseModel {
    static async query(sql, params = []) {
        try {
            const result = await pool.query(sql, params);
            return result.rows;
        } catch (error) {
            console.error('Erro na query:', error);
            throw error;
        }
    }

    static async findById(id) {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const rows = await this.query(sql, [id]);
        return rows[0];
    }

    static async findAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        return await this.query(sql);
    }

    static async create(data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
        
        const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const result = await this.query(sql, values);
        return result[0];
    }

    static async update(id, data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        
        const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const result = await this.query(sql, [...values, id]);
        return result[0];
    }

    static async delete(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
        const result = await this.query(sql, [id]);
        return result[0];
    }
} 