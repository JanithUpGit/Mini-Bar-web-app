// backend/app.js

const express = require('express');
const session = require('express-session');
const app = express();
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const port = process.env.PORT || 3000;

// Middleware for parsing JSON data in requests
app.use(express.json());

// Configure and use express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

// Set up the main user routes
app.use('/api/users', userRoutes);

// A simple test route
app.get('/', (req, res) => {
  res.send('Welcome to the Mini-Bar Backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});