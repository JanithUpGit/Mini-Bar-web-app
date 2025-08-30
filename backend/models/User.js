const db = require('../config/db');

class User {
  static async getAll() {
    const [rows] = await db.query(
      'SELECT user_id, user_name, email, user_status, user_role FROM Users'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(
      'SELECT user_id, user_name, email, user_status, user_role FROM Users WHERE user_id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async getByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  static async create(user) {
    const [result] = await db.query(
      'INSERT INTO Users (user_name, email, password_hash, user_status, user_role) VALUES (?, ?, ?, ?, ?)',
      [user.user_name, user.email, user.password_hash, user.user_status, user.user_role]
    );
    return result.insertId;
  }

  static async update(id, updatedUser) {
    const [result] = await db.query(
      'UPDATE Users SET user_name = ?, email = ?, user_status = ?, user_role = ? WHERE user_id = ?',
      [updatedUser.user_name, updatedUser.email, updatedUser.user_status, updatedUser.user_role, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM Users WHERE user_id = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async getByName(name) {
    const searchTerm = `%${name}%`;
    const [rows] = await db.query(
      'SELECT user_id, user_name, email, user_status, user_role FROM Users WHERE user_name LIKE ?',
      [searchTerm]
    );
    return rows;
  }
}

module.exports = User;
