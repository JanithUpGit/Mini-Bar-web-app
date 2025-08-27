// backend/middleware/authMiddleware.js

// Authentication Middleware
exports.isAuthenticated = (req, res, next) => {
  // session එක සහ user object එක පවතින්නේදැයි පරීක්ෂා කරයි
  if (req.session && req.session.user) { 
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({ error: 'Access Denied. Please log in.' });
  }
};


exports.isAdmin = (req, res, next) => {
  // session එක සහ user role එක පරීක්ෂා කරයි
  if (req.session && req.session.user && req.session.user.user_role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Access Denied. You do not have admin rights.' });
  }
};

