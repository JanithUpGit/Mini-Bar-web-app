const pool = require('../config/db');

class Order {
  // Create a new order with items
  static async create(order, orderItems) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderQuery = `
        INSERT INTO "Orders" (user_id, total_amount, status, delivery_address) 
        VALUES ($1, $2, $3, $4) 
        RETURNING order_id
      `;
      const orderValues = [order.user_id, order.total_amount, order.status, order.delivery_address];
      const orderResult = await client.query(orderQuery, orderValues);
      const orderId = orderResult.rows[0].order_id;

      // Insert items + update stock
      for (const item of orderItems) {
        const itemQuery = `
          INSERT INTO "Order_Items" (order_id, product_id, quantity, unit_price) 
          VALUES ($1, $2, $3, $4)
        `;
        await client.query(itemQuery, [orderId, item.product_id, item.quantity, item.unit_price]);

        const updateQuery = `
          UPDATE "Products" 
          SET stock_quantity = stock_quantity - $1 
          WHERE product_id = $2 AND stock_quantity >= $1
        `;
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

  // Get all orders for a user
  static async getOrdersByUser(userId) {
    const query = `
      SELECT * FROM "Orders" 
      WHERE user_id = $1 
      ORDER BY order_datetime DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  // Get all orders
  static async getAll() {
    const query = `
      SELECT o.order_id, u.user_name, o.total_amount, o.status, o.order_datetime, o.delivery_address 
      FROM "Orders" o 
      JOIN "Users" u ON o.user_id = u.user_id 
      ORDER BY o.order_datetime DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  // Update only status and return updated row
  static async updateStatus(orderId, newStatus) {
    const query = `
      UPDATE "Orders" 
      SET status = $1 
      WHERE order_id = $2 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [newStatus, orderId]);
    return rows[0] || null;
  }

  // Get orders with items for a user
  static async getOrdersWithItemsByUser(userId) {
    const ordersQuery = `
      SELECT o.* 
      FROM "Orders" o 
      WHERE o.user_id = $1 
      ORDER BY o.order_datetime DESC
    `;
    const { rows: orders } = await pool.query(ordersQuery, [userId]);

    if (orders.length === 0) return [];

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsQuery = `
          SELECT oi.*, p.product_name, p.image_url 
          FROM "Order_Items" oi 
          JOIN "Products" p ON oi.product_id = p.product_id 
          WHERE oi.order_id = $1
        `;
        const { rows: itemResults } = await pool.query(itemsQuery, [order.order_id]);
        return { ...order, items: itemResults };
      })
    );

    return ordersWithItems;
  }

  // Get all orders with items
  static async getAllWithItems() {
    const ordersQuery = `
      SELECT o.*, u.user_name 
      FROM "Orders" o 
      JOIN "Users" u ON o.user_id = u.user_id 
      ORDER BY o.order_datetime DESC
    `;
    const { rows: orders } = await pool.query(ordersQuery);

    if (orders.length === 0) return [];

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsQuery = `
          SELECT oi.*, p.product_name, p.image_url 
          FROM "Order_Items" oi 
          JOIN "Products" p ON oi.product_id = p.product_id 
          WHERE oi.order_id = $1
        `;
        const { rows: itemResults } = await pool.query(itemsQuery, [order.order_id]);
        return { ...order, items: itemResults };
      })
    );

    return ordersWithItems;
  }

  // Update order + items if pending
  static async update(orderId, updatedOrder, updatedItems) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const checkStatusQuery = 'SELECT status FROM "Orders" WHERE order_id = $1';
      const { rows } = await client.query(checkStatusQuery, [orderId]);
      if (rows.length === 0 || rows[0].status !== 'PENDING') {
        throw new Error('Cannot update a non-pending order.');
      }

      const orderUpdateQuery = `
        UPDATE "Orders" 
        SET delivery_address = $1, total_amount = $2 
        WHERE order_id = $3
      `;
      await client.query(orderUpdateQuery, [updatedOrder.delivery_address, updatedOrder.total_amount, orderId]);

      // Reset items
      await client.query('DELETE FROM "Order_Items" WHERE order_id = $1', [orderId]);

      for (const item of updatedItems) {
        const insertItemsQuery = `
          INSERT INTO "Order_Items" (order_id, product_id, quantity, unit_price) 
          VALUES ($1, $2, $3, $4)
        `;
        await client.query(insertItemsQuery, [orderId, item.product_id, item.quantity, item.unit_price]);
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

  // Cancel a pending order
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

      // Restore stock
      for (const item of items) {
        const stockUpdateQuery = `
          UPDATE "Products" 
          SET stock_quantity = stock_quantity + $1 
          WHERE product_id = $2
        `;
        await client.query(stockUpdateQuery, [item.quantity, item.product_id]);
      }
      
      const updateStatusQuery = `
        UPDATE "Orders" 
        SET status = $1 
        WHERE order_id = $2
      `;
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
