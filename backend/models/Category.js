// backend/models/Category.js
const pool = require('../config/db'); // db එකට වඩා pool කියන නම හොඳයි

class Category {
  static async getAll() {
    const query = 'SELECT category_id, category_name, image_url FROM "Categories"';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async create(category) {
    const query = 'INSERT INTO "Categories" (category_name, image_url) VALUES ($1, $2) RETURNING *';
    const values = [category.category_name, category.image_url];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getById(id) {
    const query = 'SELECT category_id, category_name, image_url FROM "Categories" WHERE category_id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, updatedCategory) {
    const query = `
      UPDATE "Categories"
      SET category_name = $1, image_url = $2
      WHERE category_id = $3
      RETURNING *
    `;
    const values = [updatedCategory.category_name, updatedCategory.image_url, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = `
      DELETE FROM "Categories"
      WHERE category_id = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Category;
