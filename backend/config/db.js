const { Pool } = require("pg");
const functions = require("firebase-functions");

const pool = new Pool({
  host: functions.config().db.host,
  user: functions.config().db.user,
  password: functions.config().db.password,
  database: functions.config().db.name,
  port: functions.config().db.port || 5432,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Successfully connected to PostgreSQL!");
    client.release();
  } catch (err) {
    console.error("❌ Error connecting to PostgreSQL:", err.message);
  }
}

// Only test locally
if (process.env.NODE_ENV !== "production") {
  testConnection();
}

module.exports = pool;
