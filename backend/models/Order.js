const db = require("../config/db");

class Order {
  // Create a new order with items and update stock
  static async create(order, orderItems) {
    const conn = await db.getConnection(); // Get connection for transaction
    try {
      await conn.beginTransaction();

      // Insert order
      const [orderResult] = await conn.query(
        "INSERT INTO Orders (user_id, total_amount, status, delivery_address) VALUES (?, ?, ?, ?)",
        [
          order.user_id,
          order.total_amount,
          order.status,
          order.delivery_address,
        ]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      const itemValues = orderItems.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
      ]);
      await conn.query(
        "INSERT INTO Order_Items (order_id, product_id, quantity, unit_price) VALUES ?",
        [itemValues]
      );

      // Update stock for each item
      for (const item of orderItems) {
        const [result] = await conn.query(
          "UPDATE Products SET stock_quantity = stock_quantity - ? WHERE product_id = ? AND stock_quantity >= ?",
          [item.quantity, item.product_id, item.quantity]
        );
        if (result.affectedRows === 0) {
          throw new Error(
            `Insufficient stock for product ID: ${item.product_id}`
          );
        }
      }

      await conn.commit();
      return { orderId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // Get orders by user
  static async getOrdersByUser(userId) {
    const [rows] = await db.query(
      "SELECT * FROM Orders WHERE user_id = ? ORDER BY order_datetime DESC",
      [userId]
    );
    return rows;
  }

  // Update order status
  static async updateStatus(orderId, newStatus) {
    const [result] = await db.query(
      "UPDATE Orders SET status = ? WHERE order_id = ?",
      [newStatus, orderId]
    );
    return result;
  }

  // Cancel order and restore stock
  static async cancelOrder(orderId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Check status
      const [orders] = await conn.query(
        "SELECT status FROM Orders WHERE order_id = ?",
        [orderId]
      );
      if (orders.length === 0 || orders[0].status !== "PENDING") {
        throw new Error("Only pending orders can be canceled.");
      }

      // Get order items
      const [items] = await conn.query(
        "SELECT product_id, quantity FROM Order_Items WHERE order_id = ?",
        [orderId]
      );

      // Restore stock
      for (const item of items) {
        await conn.query(
          "UPDATE Products SET stock_quantity = stock_quantity + ? WHERE product_id = ?",
          [item.quantity, item.product_id]
        );
      }

      // Update order status
      await conn.query(
        'UPDATE Orders SET status = "CANCELLED" WHERE order_id = ?',
        [orderId]
      );

      await conn.commit();
      return { message: "Order cancelled successfully." };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // Get all orders with items for a user
  static async getOrdersWithItemsByUser(userId) {
    const [orders] = await db.query(
      "SELECT * FROM Orders WHERE user_id = ? ORDER BY order_datetime DESC",
      [userId]
    );
    if (orders.length === 0) return [];

    for (const order of orders) {
      const [items] = await db.query(
        "SELECT oi.*, p.product_name, p.image_url FROM Order_Items oi JOIN Products p ON oi.product_id = p.product_id WHERE oi.order_id = ?",
        [order.order_id]
      );
      order.items = items;
    }

    return orders;
  }
  static async getAllWithItems() {
    const query = `
    SELECT o.order_id, o.user_id, u.user_name, o.total_amount, o.status, o.delivery_address, o.created_at,
           oi.product_id, oi.quantity, p.product_name, p.price
    FROM Orders o
    LEFT JOIN Users u ON o.user_id = u.user_id
    LEFT JOIN Order_Items oi ON o.order_id = oi.order_id
    LEFT JOIN Products p ON oi.product_id = p.product_id
    ORDER BY o.order_id DESC
  `;

    try {
      const [rows] = await db.query(query); // promise-based query

      // Group products under each order
      const ordersMap = new Map();

      rows.forEach((row) => {
        if (!ordersMap.has(row.order_id)) {
          ordersMap.set(row.order_id, {
            order_id: row.order_id,
            user_id: row.user_id,
            user_name: row.user_name, // include user_name
            total_amount: row.total_amount,
            status: row.status,
            delivery_address: row.delivery_address,
            created_at: row.created_at,
            items: [], // renamed to match frontend
          });
        }

        if (row.product_id) {
          // make sure product exists
          ordersMap.get(row.order_id).items.push({
            product_id: row.product_id,
            quantity: row.quantity,
            product_name: row.product_name,
            unit_price: row.price, // renamed to unit_price for consistency
          });
        }
      });

      return Array.from(ordersMap.values());
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Order;
