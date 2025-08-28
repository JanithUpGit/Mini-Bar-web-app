// backend/models/Category.js
const db = require('../config/db');

class Category {
  static getAll(callback) {
    const query = 'SELECT category_id, category_name, image_url FROM Categories';
    db.query(query, callback);
  }

  static create(category, callback) {

    const query = 'INSERT INTO Categories (category_name, image_url) VALUES (?, ?)';
    const values = [category.category_name, category.image_url];
    db.query(query, values, callback);
  }

  static getById(id, callback) {
    // image_url තීරුවද ලබා ගැනීමට query එක යාවත්කාලීන කරයි
    const query = 'SELECT category_id, category_name, image_url FROM Categories WHERE category_id = ?';
    db.query(query, [id], callback);
  }

  // Category එකක් image_url සමඟ update කිරීමට
  static update(id, updatedCategory, callback) {
    // image_url තීරුව ද UPDATE විධානයට එකතු කරයි
    const query = 'UPDATE Categories SET category_name = ?, image_url = ? WHERE category_id = ?';
    const values = [updatedCategory.category_name, updatedCategory.image_url, id];
    db.query(query, values, callback);
  }

  // Category එකක් delete කිරීමට
  static delete(id, callback) {
    const query = 'DELETE FROM Categories WHERE category_id = ?';
    db.query(query, [id], callback);
  }
}

module.exports = Category;
