const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { orderItems, delivery_address } = req.body;

    if (!userId || !orderItems || orderItems.length === 0 || !delivery_address) {
      return res.status(400).json({ error: 'User ID, order items and delivery address are required.' });
    }

    const total_amount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = { user_id: userId, total_amount, status: 'PENDING', delivery_address };

    const result = await Order.create(newOrder, orderItems);
    res.status(201).json({ message: 'Order created successfully', orderId: result.orderId });
  } catch (err) {
    if (err.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error creating order:", err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
};

// Get all orders with items (Admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.getAllWithItems();
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: 'Failed to retrieve orders with items.' });
  }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Order ID and status are required.' });
    }
    await Order.updateStatus(orderId, status);
    res.json({ message: 'Order status updated successfully.' });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

// Complete order (User)
exports.completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.updateStatus(orderId, 'COMPLETED');
    res.json({ message: 'Order completed successfully.' });
  } catch (err) {
    console.error("Error completing order:", err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

// Get user orders with items
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const orders = await Order.getOrdersWithItemsByUser(userId);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ error: 'Failed to retrieve user orders with items.' });
  }
};

// Update user order
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { delivery_address, orderItems } = req.body;

    if (!delivery_address || !orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: 'Delivery address and order items are required.' });
    }

    const total_amount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const updatedOrder = { delivery_address, total_amount };

    await Order.update(orderId, updatedOrder, orderItems);
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    if (err.message.includes('non-pending order')) {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error updating order:", err);
    res.status(500).json({ error: 'Failed to update order.' });
  }
};

// Cancel user order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.cancelOrder(orderId);
    res.json({ message: 'Order cancelled successfully.' });
  } catch (err) {
    if (err.message.includes('Only pending orders can be canceled')) {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error cancelling order:", err);
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
};
