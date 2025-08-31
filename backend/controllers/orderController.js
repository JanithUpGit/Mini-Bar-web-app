// backend/controllers/orderController.js
const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { orderItems, delivery_address } = req.body;

    if (!userId || !orderItems?.length || !delivery_address) {
      return res.status(400).json({ error: 'User ID, order items, and delivery address are required.' });
    }

    const total_amount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = { user_id: userId, total_amount, status: 'PENDING', delivery_address };

    const result = await Order.create(newOrder, orderItems);
    res.status(201).json({ message: 'Order created successfully', orderId: result.orderId });
  } catch (err) {
    if (err.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
};

// Get all orders (with items)
exports.getOrders = async (req, res) => {
  try {
    const results = await Order.getAllWithItems();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve orders with items.' });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Order ID and status are required.' });
    }

    const updated = await Order.updateStatus(orderId, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ message: 'Order status updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

// User: Complete order
exports.completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updated = await Order.updateStatus(orderId, 'COMPLETED');
    if (!updated) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ message: 'Order completed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete order.' });
  }
};

// Get user orders (with items)
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const results = await Order.getOrdersWithItemsByUser(userId);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve user orders with items.' });
  }
};

// Update user order
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { delivery_address, orderItems } = req.body;

    if (!delivery_address || !orderItems?.length) {
      return res.status(400).json({ error: 'Delivery address and order items are required.' });
    }

    const total_amount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const updatedOrder = { delivery_address, total_amount };

    const result = await Order.update(orderId, updatedOrder, orderItems);
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    if (err.message.includes('non-pending order')) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update order.' });
  }
};

// Cancel user order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await Order.cancelOrder(orderId);
    res.json({ message: 'Order cancelled successfully.' });
  } catch (err) {
    if (err.message.includes('Only pending orders can be canceled')) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
};
