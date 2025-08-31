const pool = require('../config/db');

class Product {
  // සියලුම භාණ්ඩ ලබාගැනීමට
  static async getAll() {
    const query = 'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available, image_url FROM "Products"';
    const { rows } = await pool.query(query);
    return rows;
  }

  // නව භාණ්ඩයක් නිර්මාණය කිරීමට
  static async create(product) {
    const query = 'INSERT INTO "Products" (product_name, price, description, stock_quantity, category_id, is_available, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [product.product_name, product.price, product.description, product.stock_quantity, product.category_id, product.is_available, product.image_url];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // නම අනුව භාණ්ඩයක් ලබාගැනීමට
  static async getByName(name) {
    const query = 'SELECT product_id FROM "Products" WHERE product_name = $1';
    const { rows } = await pool.query(query, [name]);
    return rows[0];
  }

  // ඇති භාණ්ඩ පමණක් ලබාගැනීමට
  static async getAllAvailable() {
    const query = 'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available, image_url FROM "Products" WHERE is_available = true';
    const { rows } = await pool.query(query);
    return rows;
  }

  // Product ID එකට අනුව product එකක් image_url සමඟ සොයාගැනීමට
  static async getById(id) {
    const query = 'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available, image_url FROM "Products" WHERE product_id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  // Product එකක් image_url සමඟ update කිරීමට
  static async update(id, updatedProduct) {
    const query = 'UPDATE "Products" SET product_name = $1, price = $2, description = $3, stock_quantity = $4, category_id = $5, is_available = $6, image_url = $7 WHERE product_id = $8';
    const values = [updatedProduct.product_name, updatedProduct.price, updatedProduct.description, updatedProduct.stock_quantity, updatedProduct.category_id, updatedProduct.is_available, updatedProduct.image_url, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // තොග ප්‍රමාණය පමණක් යාවත්කාලීන කිරීමට
  static async updateStock(id, stock_quantity) {
    const query = 'UPDATE "Products" SET stock_quantity = $1 WHERE product_id = $2';
    const { rows } = await pool.query(query, [stock_quantity, id]);
    return rows[0];
  }

  // ලබා ගත හැකි බව (is_available) පමණක් යාවත්කාලීන කිරීමට
  static async updateAvailability(id, is_available) {
    const query = 'UPDATE "Products" SET is_available = $1 WHERE product_id = $2';
    const { rows } = await pool.query(query, [is_available, id]);
    return rows[0];
  }

  // Product එකක් delete කිරීමට
  static async delete(id) {
    const query = 'DELETE FROM "Products" WHERE product_id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Product;
