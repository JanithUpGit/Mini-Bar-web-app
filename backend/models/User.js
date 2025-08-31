const pool = require('../config/db');

class User {
  static async getAll() {
    const query = 'SELECT user_id, user_name, email, user_status, user_role FROM "Users"';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getById(id) {
    const query = 'SELECT user_id, user_name, email, user_status, user_role FROM "Users" WHERE user_id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getByEmail(email) {
    const query = 'SELECT * FROM "Users" WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async create(user) {
    const query = `
      INSERT INTO "Users" (user_name, email, password_hash, user_status, user_role) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [user.user_name, user.email, user.password_hash, user.user_status, user.user_role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id, updatedUser) {
    const query = `
      UPDATE "Users" 
      SET user_name = $1, email = $2, user_status = $3, user_role = $4 
      WHERE user_id = $5
      RETURNING *
    `;
    const values = [updatedUser.user_name, updatedUser.email, updatedUser.user_status, updatedUser.user_role, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM "Users" WHERE user_id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getByName(name) {
    const query = `
      SELECT user_id, user_name, email, user_status, user_role 
      FROM "Users" 
      WHERE user_name ILIKE $1
    `;
    const searchTerm = `%${name}%`;
    const { rows } = await pool.query(query, [searchTerm]);
    return rows;
  }
}

module.exports = User;
