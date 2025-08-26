// backend/models/Order.js

const db = require('../config/db');

class Order {
  static create(order, orderItems, callback) {
    db.beginTransaction(err => {
      if (err) return callback(err);

      const orderQuery = 'INSERT INTO Orders (user_id, total_amount, status) VALUES (?, ?, ?)';
      const orderValues = [order.user_id, order.total_amount, order.status];

      db.query(orderQuery, orderValues, (err, orderResult) => {
        if (err) {
          return db.rollback(() => callback(err));
        }

        const orderId = orderResult.insertId;

        // Order එකේ items එකින් එක Order_Items table එකට එකතු කිරීම
        const itemQuery = 'INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES ?';
        const itemValues = orderItems.map(item => [orderId, item.product_id, item.quantity, item.price]);

        db.query(itemQuery, [itemValues], (err) => {
          if (err) {
            return db.rollback(() => callback(err));
          }

          // එක් එක් product එකේ stock එක අඩු කිරීම
          const stockUpdatePromises = orderItems.map(item => {
            return new Promise((resolve, reject) => {
              const updateQuery = 'UPDATE Products SET stock_quantity = stock_quantity - ? WHERE product_id = ? AND stock_quantity >= ?';
              const updateValues = [item.quantity, item.product_id, item.quantity];
              db.query(updateQuery, updateValues, (err, updateResult) => {
                if (err) return reject(err);
                if (updateResult.affectedRows === 0) return reject(new Error('Insufficient stock for product ID: ' + item.product_id));
                resolve();
              });
            });
          });

          Promise.all(stockUpdatePromises)
            .then(() => {
              db.commit(commitErr => {
                if (commitErr) return db.rollback(() => callback(commitErr));
                callback(null, { orderId });
              });
            })
            .catch(promiseErr => {
              db.rollback(() => callback(promiseErr));
            });
        });
      });
    });
  }

  // සියලුම orders ලබාගැනීමට
  static getAll(callback) {
    const query = 'SELECT o.order_id, u.username, o.total_amount, o.status, o.created_at FROM Orders o JOIN Users u ON o.user_id = u.user_id ORDER BY o.created_at DESC';
    db.query(query, callback);
  }
}

module.exports = Order;