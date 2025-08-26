// backend/middleware/authMiddleware.js

// Authentication Middleware
exports.isAuthenticated = (req, res, next) => {
  // session එක සහ user object එක පවතින්නේදැයි පරීක්ෂා කරයි
  if (req.session && req.session.user) { 
    req.user = req.session.user; // req.user ලෙස user object එක ලබා දෙයි
    next();
  } else {
    res.status(401).json({ error: 'Access Denied. Please log in.' });
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

