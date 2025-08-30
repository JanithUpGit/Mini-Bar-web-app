const db = require('../config/db');

class Category {

  static async getAll() {
    try {
      const [rows] = await db.query('SELECT category_id, category_name, image_url FROM Categories');
      return rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async create(category) {
    try {
      const query = 'INSERT INTO Categories (category_name, image_url) VALUES (?, ?)';
      const values = [category.category_name, category.image_url];
      const [result] = await db.query(query, values);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getById(id) {
    try {
      const query = 'SELECT category_id, category_name, image_url FROM Categories WHERE category_id = ?';
      const [rows] = await db.query(query, [id]);
      return rows[0]; // return single category
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async update(id, updatedCategory) {
    try {
      const query = 'UPDATE Categories SET category_name = ?, image_url = ? WHERE category_id = ?';
      const values = [updatedCategory.category_name, updatedCategory.image_url, id];
      const [result] = await db.query(query, values);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM Categories WHERE category_id = ?';
      const [result] = await db.query(query, [id]);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports = Category;
