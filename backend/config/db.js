const { Pool } = require("pg");
require("dotenv").config();

console.log("Connecting to DB:", process.env.DB_NAME);

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // Required for AWS RDS
  },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Successfully connected to the PostgreSQL database!");
    client.release();
  } catch (err) {
    console.error("❌ Error connecting to the PostgreSQL database:", err.message);
  }
}

testConnection();

module.exports = pool;
