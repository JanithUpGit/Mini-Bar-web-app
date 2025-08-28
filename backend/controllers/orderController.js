// backend/controllers/orderController.js

const Order = require('../models/Order');

// අලුත් order එකක් සාදන්න
exports.createOrder = (req, res) => {
  // req.user.user_id එක භාවිතා කර user ID එක session එකෙන් ලබාගැනීම
  const userId = req.user.user_id; 
  const { orderItems, delivery_address } = req.body;
  
  if (!userId || !orderItems || orderItems.length === 0 || !delivery_address) {
    return res.status(400).json({ error: 'User ID, order items and delivery address are required.' });
  }

  const total_amount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // order object එකට user ID එක එකතු කිරීම
  const newOrder = { user_id: userId, total_amount, status: 'PENDING', delivery_address };

  Order.create(newOrder, orderItems, (err, result) => {
    if (err) {
      if (err.message.includes('Insufficient stock')) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Failed to create order.' });
    }
    res.status(201).json({ message: 'Order created successfully', orderId: result.orderId });
  });
};

// සියලුම orders ලබාගන්න
exports.getOrders = (req, res) => {
  Order.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve orders.' });
    }
    res.json(results);
  });
};

// Admin ට order status එක update කිරීමට
exports.updateOrderStatus = (req, res) => {
  const { orderId, status } = req.body;
  if (!orderId || !status) {
    return res.status(400).json({ error: 'Order ID and status are required.' });
  }
  Order.updateStatus(orderId, status, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order status.' });
    }
    res.json({ message: 'Order status updated successfully.' });
  });
};

// User ට order එක complete කිරීමට
exports.completeOrder = (req, res) => {
  const { orderId } = req.params;
  Order.updateStatus(orderId, 'COMPLETED', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order status.' });
    }
    res.json({ message: 'Order completed successfully.' });
  });
};


exports.getUserOrders = (req, res) => {
  const userId = req.user.user_id; 
  Order.getOrdersByUser(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve user orders.' });
    }
    res.json(results);
  });
};

// User ට order එකක් update කිරීමට
exports.updateOrder = (req, res) => {
  const { orderId } = req.params;
  const { delivery_address, orderItems } = req.body;
  if (!delivery_address || !orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: 'Delivery address and order items are required.' });
  }
  const total_amount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const updatedOrder = { delivery_address, total_amount };
  Order.update(orderId, updatedOrder, orderItems, (err, result) => {
    if (err) {
      if (err.message.includes('non-pending order')) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Failed to update order.' });
    }
    res.json({ message: 'Order updated successfully' });
  });
};

// User ට order එකක් cancel කිරීමට
exports.cancelOrder = (req, res) => {
  const { orderId } = req.params;
  Order.cancelOrder(orderId, (err, result) => {
    if (err) {
      if (err.message.includes('Only pending orders can be canceled')) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Failed to cancel order.' });
    }
    res.json({ message: 'Order cancelled successfully.' });
  });
};