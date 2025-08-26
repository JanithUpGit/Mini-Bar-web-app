// backend/models/Product.js

const db = require('../config/db');

class Product {
  // සියලුම products ලබාගැනීමට
  static getAll(callback) {
    const query = 'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available FROM Products';
    db.query(query, callback);
  }

  // අලුත් product එකක් එකතු කිරීමට
  static create(product, callback) {
    const query = 'INSERT INTO Products (product_name, price, description, stock_quantity, category_id, is_available) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [product.product_name, product.price, product.description, product.stock_quantity, product.category_id, product.is_available];
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
    const query = 'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available FROM Products WHERE stock_quantity > 0';
    db.query(query, callback);
  }

  // Product ID එකට අනුව product එකක් සොයාගැනීමට
  static getById(id, callback) {
    const query = 'SELECT product_id, product_name, price, description, stock_quantity, category_id, is_available FROM Products WHERE product_id = ?';
    db.query(query, [id], callback);
  }

  // Product එකක් update කිරීමට
  static update(id, updatedProduct, callback) {
    const query = 'UPDATE Products SET product_name = ?, price = ?, description = ?, stock_quantity = ?, category_id = ?, is_available = ? WHERE product_id = ?';
    const values = [updatedProduct.product_name, updatedProduct.price, updatedProduct.description, updatedProduct.stock_quantity, updatedProduct.category_id, updatedProduct.is_available, id];
    db.query(query, values, callback);
  }

  // Product එකක් delete කිරීමට
  static delete(id, callback) {
    const query = 'DELETE FROM Products WHERE product_id = ?';
    db.query(query, [id], callback);
  }
}

module.exports = Product;