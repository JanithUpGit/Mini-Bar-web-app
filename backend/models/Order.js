const pool = require('../config/db');

class Order {
  // නව ඇණවුමක් සහ එහි භාණ්ඩ නිර්මාණය කිරීමට
  static async create(order, orderItems) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderQuery = 'INSERT INTO "Orders" (user_id, total_amount, status, delivery_address) VALUES ($1, $2, $3, $4) RETURNING order_id';
      const orderValues = [order.user_id, order.total_amount, order.status, order.delivery_address];
      const orderResult = await client.query(orderQuery, orderValues);
      const orderId = orderResult.rows[0].order_id;

      // භාණ්ඩ එකතු කිරීමට සහ stock අඩු කිරීමට
      for (const item of orderItems) {
        const itemQuery = 'INSERT INTO "Order_Items" (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)';
        await client.query(itemQuery, [orderId, item.product_id, item.quantity, item.price]);

        const updateQuery = 'UPDATE "Products" SET stock_quantity = stock_quantity - $1 WHERE product_id = $2 AND stock_quantity >= $1';
        const updateResult = await client.query(updateQuery, [item.quantity, item.product_id]);

        if (updateResult.rowCount === 0) {
          throw new Error('Insufficient stock for product ID: ' + item.product_id);
        }
      }

      await client.query('COMMIT');
      return { orderId };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // පරිශීලකයෙකුගේ සියලු ඇණවුම් ලබාගැනීමට
  static async getOrdersByUser(userId) {
    const query = 'SELECT * FROM "Orders" WHERE user_id = $1 ORDER BY order_datetime DESC';
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  // සියලු ඇණවුම් ලබාගැනීමට
  static async getAll() {
    const query = 'SELECT o.order_id, u.user_name, o.total_amount, o.status, o.order_datetime, o.delivery_address FROM "Orders" o JOIN "Users" u ON o.user_id = u.user_id ORDER BY o.order_datetime DESC';
    const { rows } = await pool.query(query);
    return rows;
  }

  // Order status එක update කිරීමට
  static async updateStatus(orderId, newStatus) {
    const query = 'UPDATE "Orders" SET status = $1 WHERE order_id = $2';
    const { rowCount } = await pool.query(query, [newStatus, orderId]);
    return rowCount > 0;
  }

  // නව ශ්‍රිතය: පරිශීලකයෙකුගේ සියලු ඇණවුම් සහ ඒවායේ භාණ්ඩ ලබාගැනීමට
  static async getOrdersWithItemsByUser(userId) {
    const ordersQuery = 'SELECT o.* FROM "Orders" o WHERE o.user_id = $1 ORDER BY o.order_datetime DESC';
    const { rows: orders } = await pool.query(ordersQuery, [userId]);

    if (orders.length === 0) {
      return [];
    }

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsQuery = 'SELECT oi.*, p.product_name, p.image_url FROM "Order_Items" oi JOIN "Products" p ON oi.product_id = p.product_id WHERE oi.order_id = $1';
        const { rows: itemResults } = await pool.query(itemsQuery, [order.order_id]);
        return { ...order, items: itemResults };
      })
    );

    return ordersWithItems;
  }

  // නව ශ්‍රිතය: සියලු ඇණවුම් සහ ඒවායේ භාණ්ඩ ලබාගැනීමට
  static async getAllWithItems() {
    const ordersQuery = 'SELECT o.*, u.user_name FROM "Orders" o JOIN "Users" u ON o.user_id = u.user_id ORDER BY o.order_datetime DESC';
    const { rows: orders } = await pool.query(ordersQuery);

    if (orders.length === 0) {
      return [];
    }

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsQuery = 'SELECT oi.*, p.product_name FROM "Order_Items" oi JOIN "Products" p ON oi.product_id = p.product_id WHERE oi.order_id = $1';
        const { rows: itemResults } = await pool.query(itemsQuery, [order.order_id]);
        return { ...order, items: itemResults };
      })
    );

    return ordersWithItems;
  }

  // Order එකක details සහ items update කිරීමට (Pending තත්ත්වය යටතේ)
  static async update(orderId, updatedOrder, updatedItems) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const checkStatusQuery = 'SELECT status FROM "Orders" WHERE order_id = $1';
      const { rows } = await client.query(checkStatusQuery, [orderId]);
      if (rows.length === 0 || rows[0].status !== 'PENDING') {
        throw new Error('Cannot update a non-pending order.');
      }

      const orderUpdateQuery = 'UPDATE "Orders" SET delivery_address = $1, total_amount = $2 WHERE order_id = $3';
      await client.query(orderUpdateQuery, [updatedOrder.delivery_address, updatedOrder.total_amount, orderId]);

      const deleteItemsQuery = 'DELETE FROM "Order_Items" WHERE order_id = $1';
      await client.query(deleteItemsQuery, [orderId]);

      for (const item of updatedItems) {
        const insertItemsQuery = 'INSERT INTO "Order_Items" (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)';
        await client.query(insertItemsQuery, [orderId, item.product_id, item.quantity, item.price]);
      }

      await client.query('COMMIT');
      return { message: 'Order updated successfully' };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // Order එකක් cancel කිරීමට
  static async cancelOrder(orderId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const checkStatusQuery = 'SELECT status FROM "Orders" WHERE order_id = $1';
      const { rows } = await client.query(checkStatusQuery, [orderId]);
      if (rows.length === 0 || rows[0].status !== 'PENDING') {
        throw new Error('Only pending orders can be canceled.');
      }

      const itemsQuery = 'SELECT product_id, quantity FROM "Order_Items" WHERE order_id = $1';
      const { rows: items } = await client.query(itemsQuery, [orderId]);

      // Stock නැවත වැඩි කිරීමට
      for (const item of items) {
        const stockUpdateQuery = 'UPDATE "Products" SET stock_quantity = stock_quantity + $1 WHERE product_id = $2';
        await client.query(stockUpdateQuery, [item.quantity, item.product_id]);
      }
      
      const updateStatusQuery = 'UPDATE "Orders" SET status = $1 WHERE order_id = $2';
      await client.query(updateStatusQuery, ['CANCELLED', orderId]);

      await client.query('COMMIT');
      return { message: 'Order cancelled successfully.' };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = Order;
