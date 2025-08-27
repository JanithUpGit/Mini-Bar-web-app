// backend/app.js

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();

const port = process.env.PORT || 3000;

// Middleware වල නිවැරදි පිළිවෙළ
app.use(express.json());

// Session middleware එක cors වලට පෙර තිබිය යුතුයි
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

// CORS middleware එක නිවැරදිව configure කරන්න
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Mini-Bar Backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});