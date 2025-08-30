// backend/app.js

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mysql = require("mysql2/promise"); // Add this
const app = express();
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config();

const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true, 
  connectionLimit: 10,      
  queueLimit: 0 
});

// Middleware වල නිවැරදි පිළිවෙළ
app.use(express.json());

// CORS middleware එක නිවැරදිව configure කරන්න
app.use(
  cors({
    origin: process.env.FRONT_PORT, // Vercel environment variable එක
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);


// Test connection
app.get('/api/test-connection', async (req, res) => {
    try {
        const [rows] = await (await connection).execute('SELECT 1 + 1 AS solution');
        if (rows[0].solution === 2) {
            res.status(200).send('Database connected successfully!');
        } else {
            res.status(500).send('Connection failed or incorrect query result.');
        }
    } catch (error) {
        console.error('Connection test error:', error);
        res.status(500).send('Could not connect to the database.');
    }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the Mini-Bar Backend!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});