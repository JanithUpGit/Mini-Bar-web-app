

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
router.post('/', isAuthenticated, orderController.createOrder);
router.get('/', isAuthenticated, isAdmin, orderController.getOrders);

module.exports = router;