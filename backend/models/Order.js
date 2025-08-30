// backend/models/Order.js

const db = require('../config/db');

class Order {
  
    static create(order, orderItems, callback) {
    db.beginTransaction(err => {
      if (err) return callback(err);
      const orderQuery = 'INSERT INTO Orders (user_id, total_amount, status, delivery_address) VALUES (?, ?, ?, ?)';
      const orderValues = [order.user_id, order.total_amount, order.status, order.delivery_address];
      db.query(orderQuery, orderValues, (err, orderResult) => {
        if (err) return db.rollback(() => callback(err));

        const orderId = orderResult.insertId; 
        const itemQuery = 'INSERT INTO Order_Items (order_id, product_id, quantity, unit_price) VALUES ?';
        const itemValues = orderItems.map(item => [orderId, item.product_id, item.quantity, item.price]);
        db.query(itemQuery, [itemValues], (err) => {
          if (err) return db.rollback(() => callback(err));
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

 
    static getOrdersByUser(userId, callback) {
        const query = 'SELECT * FROM Orders WHERE user_id = ? ORDER BY order_datetime DESC';
        db.query(query, [userId], callback);
    }

    static getAll(callback) {
        const query = 'SELECT o.order_id, u.user_name, o.total_amount, o.status, o.order_datetime, o.delivery_address FROM Orders o JOIN Users u ON o.user_id = u.user_id ORDER BY o.order_datetime DESC';
        db.query(query, callback);
    }
  // Order status එක update කිරීමට
  static updateStatus(orderId, newStatus, callback) {
    const query = 'UPDATE Orders SET status = ? WHERE order_id = ?';
    db.query(query, [newStatus, orderId], callback);
  }

  // නව ශ්‍රිතය: පරිශීලකයෙකුගේ සියලු ඇණවුම් සහ ඒවායේ භාණ්ඩ ලබාගැනීමට
    static getOrdersWithItemsByUser(userId, callback) {
        const ordersQuery = 'SELECT o.* FROM Orders o WHERE o.user_id = ? ORDER BY o.order_datetime DESC';
        db.query(ordersQuery, [userId], (err, orders) => {
            if (err) return callback(err);
            if (orders.length === 0) return callback(null, []);

            const ordersWithItems = [];
            let completedQueries = 0;

            orders.forEach(order => {
                const itemsQuery = 'SELECT oi.*, p.product_name, p.image_url FROM Order_Items oi JOIN Products p ON oi.product_id = p.product_id WHERE oi.order_id = ?';
                db.query(itemsQuery, [order.order_id], (err, itemResults) => {
                    if (err) return callback(err);
                    order.items = itemResults;
                    ordersWithItems.push(order);
                    completedQueries++;

                    if (completedQueries === orders.length) {
                        callback(null, ordersWithItems);
                    }
                });
            });
        });
    }

     static getAllWithItems(callback) {
        const ordersQuery = 'SELECT o.*, u.user_name FROM Orders o JOIN Users u ON o.user_id = u.user_id ORDER BY o.order_datetime DESC';
        db.query(ordersQuery, (err, orders) => {
            if (err) return callback(err);
            if (orders.length === 0) return callback(null, []);

            const ordersWithItems = [];
            let completedQueries = 0;

            orders.forEach(order => {
                const itemsQuery = 'SELECT oi.*, p.product_name FROM Order_Items oi JOIN Products p ON oi.product_id = p.product_id WHERE oi.order_id = ?';
                db.query(itemsQuery, [order.order_id], (err, itemResults) => {
                    if (err) return callback(err);
                    order.items = itemResults;
                    ordersWithItems.push(order);
                    completedQueries++;

                    if (completedQueries === orders.length) {
                        callback(null, ordersWithItems);
                    }
                });
            });
        });
    }



  // Order එකක details සහ items update කිරීමට (Pending තත්ත්වය යටතේ)
  static update(orderId, updatedOrder, updatedItems, callback) {
    db.beginTransaction(err => {
      if (err) return callback(err);
      const checkStatusQuery = 'SELECT status FROM Orders WHERE order_id = ?';
      db.query(checkStatusQuery, [orderId], (err, results) => {
        if (err || results.length === 0) {
          return db.rollback(() => callback(err || new Error('Order not found')));
        }
        const currentStatus = results[0].status;
        if (currentStatus !== 'PENDING') {
          return db.rollback(() => callback(new Error('Cannot update a non-pending order.')));
        }
        const orderUpdateQuery = 'UPDATE Orders SET delivery_address = ?, total_amount = ? WHERE order_id = ?';
        const orderUpdateValues = [updatedOrder.delivery_address, updatedOrder.total_amount, orderId];
        db.query(orderUpdateQuery, orderUpdateValues, (err) => {
          if (err) return db.rollback(() => callback(err));
          const deleteItemsQuery = 'DELETE FROM Order_Items WHERE order_id = ?';
          db.query(deleteItemsQuery, [orderId], (err) => {
            if (err) return db.rollback(() => callback(err));
            const insertItemsQuery = 'INSERT INTO Order_Items (order_id, product_id, quantity, unit_price) VALUES ?';
            const itemValues = updatedItems.map(item => [orderId, item.product_id, item.quantity, item.price]);
            db.query(insertItemsQuery, [itemValues], (err) => {
              if (err) return db.rollback(() => callback(err));
              db.commit(commitErr => {
                if (commitErr) return db.rollback(() => callback(commitErr));
                callback(null, { message: 'Order updated successfully' });
              });
            });
          });
        });
      });
    });
  }

  // Order එකක් cancel කිරීමට
  static cancelOrder(orderId, callback) {
    db.beginTransaction(err => {
        if (err) return callback(err);

        // Check if the order status is 'PENDING'
        db.query('SELECT status FROM Orders WHERE order_id = ?', [orderId], (err, results) => {
            if (err) return db.rollback(() => callback(err));
            if (results.length === 0 || results[0].status !== 'PENDING') {
                return db.rollback(() => callback(new Error('Only pending orders can be canceled.')));
            }

            // Get order items to restore stock
            db.query('SELECT product_id, quantity FROM Order_Items WHERE order_id = ?', [orderId], (err, items) => {
                if (err) return db.rollback(() => callback(err));

                // Restore stock for each product
                const stockRestorePromises = items.map(item => {
                    return new Promise((resolve, reject) => {
                        db.query('UPDATE Products SET stock_quantity = stock_quantity + ? WHERE product_id = ?', [item.quantity, item.product_id], (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });
                });

                Promise.all(stockRestorePromises)
                    .then(() => {
                        // Update order status to 'CANCELLED'
                        db.query('UPDATE Orders SET status = "CANCELLED" WHERE order_id = ?', [orderId], (err) => {
                            if (err) return db.rollback(() => callback(err));
                            db.commit(commitErr => {
                                if (commitErr) return db.rollback(() => callback(commitErr));
                                callback(null, { message: 'Order cancelled successfully.' });
                            });
                        });
                    })
                    .catch(promiseErr => {
                        db.rollback(() => callback(promiseErr));
                    });
            });
        });
    });
  }
}

module.exports = Order;