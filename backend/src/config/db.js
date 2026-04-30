// Import mysql2 with promise support so we can use async/await queries.
const mysql = require("mysql2/promise");

// Create a connection pool that can be reused across the application.
// A pool is better than opening a brand-new connection for every request.
const pool = mysql.createPool({
  // MySQL host name such as localhost.
  host: process.env.DB_HOST || "localhost",
  // MySQL port number, defaulting to 3306.
  port: Number(process.env.DB_PORT || 3306),
  // MySQL username.
  user: process.env.DB_USER || "root",
  // MySQL password.
  password: process.env.DB_PASSWORD || "",
  // Database name such as work_zone.
  database: process.env.DB_NAME || "work_zone",
  // Keep waiting instead of failing immediately if all connections are busy.
  waitForConnections: true,
  // Allow up to 10 open connections in the pool.
  connectionLimit: 10
});

// Export the pool so other files can run database queries.
module.exports = pool;
