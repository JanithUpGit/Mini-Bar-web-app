const db = require('../config/db');

class Product {
  // Get all products with image_url
  static async getAll() {
    const [rows] = await db.query(
      'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available, image_url FROM Products'
    );
    return rows;
  }

  static async create(product) {
    const [result] = await db.query(
      'INSERT INTO Products (product_name, price, description, stock_quantity, category_id, is_available, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [product.product_name, product.price, product.description, product.stock_quantity, product.category_id, product.is_available, product.image_url]
    );
    return result.insertId;
  }

  static async getByName(name) {
    const [rows] = await db.query(
      'SELECT product_id FROM Products WHERE product_name = ?',
      [name]
    );
    return rows[0] || null;
  }

  static async getAllAvailable() {
    const [rows] = await db.query(
      'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available, image_url FROM Products WHERE is_available = 1'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(
      'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available, image_url FROM Products WHERE product_id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async update(id, updatedProduct) {
    const [result] = await db.query(
      'UPDATE Products SET product_name = ?, price = ?, description = ?, stock_quantity = ?, category_id = ?, is_available = ?, image_url = ? WHERE product_id = ?',
      [updatedProduct.product_name, updatedProduct.price, updatedProduct.description, updatedProduct.stock_quantity, updatedProduct.category_id, updatedProduct.is_available, updatedProduct.image_url, id]
    );
    return result.affectedRows;
  }

  static async updateStock(id, stock_quantity) {
    const [result] = await db.query(
      'UPDATE Products SET stock_quantity = ? WHERE product_id = ?',
      [stock_quantity, id]
    );
    return result.affectedRows;
  }

  static async updateAvailability(id, is_available) {
    const [result] = await db.query(
      'UPDATE Products SET is_available = ? WHERE product_id = ?',
      [is_available, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM Products WHERE product_id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = Product;
