// backend/middleware/authMiddleware.js

// Authentication Middleware
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userRole) {
    next();
  } else {
    res.status(401).send('Access Denied. Please log in.');
  }
};

// Admin Role Check Middleware
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.userRole === 'ADMIN') {
    next();
  } else {
    res.status(403).send('Access Denied. You do not have admin rights.');
  }
};