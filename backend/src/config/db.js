// Import mysql2 with promise support so we can use async/await queries.
const mysql = require("mysql2/promise");

// Build SSL config when DB_SSL is enabled. Hosted MySQL providers like Aiven
// require SSL for every connection. If DB_SSL_CA holds a PEM bundle, verify
// against it; otherwise fall back to encryption without verification (fine
// for a free-tier demo, not production).
function buildSslConfig() {
  if (process.env.DB_SSL !== "true") {
    return undefined;
  }

  if (process.env.DB_SSL_CA) {
    return {
      ca: process.env.DB_SSL_CA,
      rejectUnauthorized: true
    };
  }

  return { rejectUnauthorized: false };
}

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
  // SSL config for hosted providers that mandate it (Aiven, PlanetScale, etc).
  ssl: buildSslConfig(),
  // Keep waiting instead of failing immediately if all connections are busy.
  waitForConnections: true,
  // Allow up to 10 open connections in the pool.
  connectionLimit: 10
});

// Export the pool so other files can run database queries.
module.exports = pool;
