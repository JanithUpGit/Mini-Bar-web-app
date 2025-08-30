const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

// MySQL Pool (better for serverless)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Test connection
app.get("/api/test-connection", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT 1 + 1 AS solution");
    res.status(200).send(`Database connected: ${rows[0].solution}`);
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).send("Could not connect to DB");
  }
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.get("/", (req, res) => {
  res.send("Welcome to the Mini-Bar Backend!");
});

module.exports = app; // ✅ Export instead of listen()
