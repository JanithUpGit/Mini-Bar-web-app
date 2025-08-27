// backend/models/User.js

const db = require('../config/db');

class User {
  static getAll(callback) {
    const query = 'SELECT user_id, user_name, email, user_status, user_role FROM Users';
    db.query(query, callback);
  }

  static getById(id, callback) {
    const query = 'SELECT user_id, user_name, email, user_status, user_role FROM Users WHERE user_id = ?';
    db.query(query, [id], callback);
  }

 static getByEmail(email, callback) {
    const query = "SELECT * FROM Users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length > 0) {
        callback(null, results[0]);
      } else {
        callback(null, null);
      }
    });
  }
  static create(user, callback) {
    const query = 'INSERT INTO Users (user_name, email, password_hash, user_status, user_role) VALUES (?, ?, ?, ?, ?)';
    const values = [user.user_name, user.email, user.password_hash, user.user_status, user.user_role];
    db.query(query, values, callback);
  }

  static update(id, updatedUser, callback) {
    const query = 'UPDATE Users SET user_name = ?, email = ?, user_status = ?, user_role = ? WHERE user_id = ?';
    const values = [updatedUser.user_name, updatedUser.email, updatedUser.user_status, updatedUser.user_role, id];
    db.query(query, values, callback);
  }

  static delete(id, callback) {
    const query = 'DELETE FROM Users WHERE user_id = ?';
    db.query(query, [id], callback);
  }
}

module.exports = User;