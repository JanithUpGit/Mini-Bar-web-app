// backend/models/Category.js

const db = require('../config/db');

class Category {
  // සියලුම categories ලබාගැනීමට
  static getAll(callback) {
    const query = 'SELECT category_id, category_name FROM Categories';
    db.query(query, callback);
  }

  // අලුත් category එකක් එකතු කිරීමට
  static create(category, callback) {
    const query = 'INSERT INTO Categories (category_name) VALUES (?)';
    const values = [category.category_name];
    db.query(query, values, callback);
  }

  // Category ID එකට අනුව category එකක් සොයාගැනීමට
  static getById(id, callback) {
    const query = 'SELECT category_id, category_name FROM Categories WHERE category_id = ?';
    db.query(query, [id], callback);
  }

  // Category එකක් update කිරීමට
  static update(id, updatedCategory, callback) {
    const query = 'UPDATE Categories SET category_name = ? WHERE category_id = ?';
    const values = [updatedCategory.category_name, id];
    db.query(query, values, callback);
  }

  // Category එකක් delete කිරීමට
  static delete(id, callback) {
    const query = 'DELETE FROM Categories WHERE category_id = ?';
    db.query(query, [id], callback);
  }
}

module.exports = Category;