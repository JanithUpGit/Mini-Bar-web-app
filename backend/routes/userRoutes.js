// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/login', userController.loginUser);
router.post('/register', userController.createUser);

// Protected endpoints - require authentication
router.post('/logout', isAuthenticated, userController.logoutUser);

// Admin-only endpoints - require admin role
router.get('/', isAuthenticated, isAdmin, userController.getUsers);
router.get('/:id', isAuthenticated, isAdmin, userController.getUserById);
router.put('/:id', isAuthenticated, isAdmin, userController.updateUser);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;