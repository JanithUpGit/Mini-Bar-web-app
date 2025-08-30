require('dotenv').config();
const mysql = require('mysql2/promise'); // Use promise-based client

// Create a pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

// Test connection (optional)
async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('Successfully connected to the database!');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

testConnection();

module.exports = pool;
