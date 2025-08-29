// backend/models/Product.js

const db = require('../config/db');

class Product {
  // සියලුම products image_url සමඟ ලබාගැනීමට
  static getAll(callback) {
    const query = 'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available, image_url FROM Products';
    db.query(query, callback);
  }

  static create(product, callback) {
    const query = 'INSERT INTO Products (product_name, price, description, stock_quantity, category_id, is_available, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [product.product_name, product.price, product.description, product.stock_quantity, product.category_id, product.is_available, product.image_url];
    db.query(query, values, callback);
  }

  static getByName(name, callback) {
    const query = 'SELECT product_id FROM Products WHERE product_name = ?';
    db.query(query, [name], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]); 
    });
  }
  
  static getAllAvailable(callback) {
    const query = 'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available, image_url FROM Products WHERE is_available = 1';
    db.query(query, callback);
  }

  // Product ID එකට අනුව product එකක් image_url සමඟ සොයාගැනීමට
  static getById(id, callback) {
    const query = 'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available, image_url FROM Products WHERE product_id = ?';
    db.query(query, [id], callback);
  }

  // Product එකක් image_url සමඟ update කිරීමට
  static update(id, updatedProduct, callback) {
    const query = 'UPDATE Products SET product_name = ?, price = ?, description = ?, stock_quantity = ?, category_id = ?, is_available = ?, image_url = ? WHERE product_id = ?';
    const values = [updatedProduct.product_name, updatedProduct.price, updatedProduct.description, updatedProduct.stock_quantity, updatedProduct.category_id, updatedProduct.is_available, updatedProduct.image_url, id];
    db.query(query, values, callback);
  }

  // තොග ප්‍රමාණය පමණක් යාවත්කාලීන කිරීමට නව ශ්‍රිතය
  static updateStock(id, stock_quantity, callback) {
    const query = 'UPDATE Products SET stock_quantity = ? WHERE product_id = ?';
    db.query(query, [stock_quantity, id], callback);
  }

  // ලබා ගත හැකි බව (is_available) පමණක් යාවත්කාලීන කිරීමට නව ශ්‍රිතය
  static updateAvailability(id, is_available, callback) {
    const query = 'UPDATE Products SET is_available = ? WHERE product_id = ?';
    db.query(query, [is_available, id], callback);
  }

  // Product එකක් delete කිරීමට
  static delete(id, callback) {
    const query = 'DELETE FROM Products WHERE product_id = ?';
    db.query(query, [id], callback);
  }
}

module.exports = Product;