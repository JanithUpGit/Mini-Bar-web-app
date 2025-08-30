// backend/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Create a new order (Authenticated user)
router.post('/', isAuthenticated, orderController.createOrder);

router.put('/status', isAuthenticated, isAdmin, orderController.updateOrderStatus);

// User ට තමන්ගේ orders ලබාගැනීමට
router.get('/my-orders', isAuthenticated, orderController.getUserOrders);

// User ට order එකක් update කිරීමට (Pending තත්ත්වයේදී)
router.put('/:orderId', isAuthenticated, orderController.updateOrder);

// User ට order එකක් cancel කිරීමට (Pending තත්ත්වයේදී)
router.put('/:orderId/cancel', isAuthenticated, orderController.cancelOrder);

// User ට order එකක් complete කිරීමට
router.put('/:orderId/complete', isAuthenticated, orderController.completeOrder);

router.get('/', isAuthenticated, isAdmin, orderController.getOrders);



module.exports = router;