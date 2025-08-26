// backend/routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.get('/',categoryController.getCategories);

// Create a new category (Admin access)
router.post('/', isAuthenticated, isAdmin, categoryController.createCategory);

// Get a single category by ID (Admin access)
router.get('/:id', categoryController.getCategoryById);

// Update a category by ID (Admin access)
router.put('/:id', isAuthenticated, isAdmin, categoryController.updateCategory);

// Delete a category by ID (Admin access)
router.delete('/:id', isAuthenticated, isAdmin, categoryController.deleteCategory);

module.exports = router;