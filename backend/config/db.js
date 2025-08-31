// backend/config/db.js

const { Pool } = require('pg');

console.log(process.env.DB_NAME);
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  max: 20, 
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the PostgreSQL database!');
    client.release(); // සම්බන්ධතාවය pool එකට මුදා හැරීම
  } catch (err) {
    console.error('Error connecting to the PostgreSQL database:', err.message);
  }
}

testConnection();

module.exports = pool;