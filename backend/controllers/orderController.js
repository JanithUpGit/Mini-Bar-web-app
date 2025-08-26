// backend/controllers/orderController.js

const Order = require('../models/Order');

// අලුත් order එකක් සාදන්න
exports.createOrder = (req, res) => {
  const { user_id, orderItems } = req.body;
  
  if (!user_id || !orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: 'User ID and order items are required.' });
  }

  const total_amount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const newOrder = { user_id, total_amount, status: 'Pending' };

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