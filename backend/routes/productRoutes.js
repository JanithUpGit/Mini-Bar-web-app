// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Get all products (Admin access)
router.get('/', isAuthenticated, isAdmin, productController.getProducts);

// Create a new product (Admin access)
router.post('/', isAuthenticated, isAdmin, productController.createProduct);

router.get('/available', productController.getAvailableProducts);

// Get a single product by ID (Admin access)
router.get('/:id', isAuthenticated, isAdmin, productController.getProductById);

// Update a product by ID (Admin access)
router.put('/:id', isAuthenticated, isAdmin, productController.updateProduct);

// Delete a product by ID (Admin access)
router.delete('/:id', isAuthenticated, isAdmin, productController.deleteProduct);

module.exports = router;