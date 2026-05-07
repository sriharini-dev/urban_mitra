// Import Express to create the web server.
const express = require("express");
const cors = require("cors");
// Import the shared MySQL connection pool for the health check.
const pool = require("./config/db");
// Import user signup routes.
const userRoutes = require("./modules/user/userRoutes");
// Import helper signup routes.
const helperRoutes = require("./modules/helper/helperRoutes");
// Import shared login routes.
const authRoutes = require("./modules/auth/authRoutes");
// Import plan routes.
const planRoutes = require("./modules/plan/planRoutes");
// Import booking routes.
const bookingRoutes = require("./modules/booking/bookingRoutes");
// Import admin routes.
const adminRoutes = require("./modules/admin/adminRoutes");
const {
  readJsonBody,
  parseJsonBody,
  handleJsonBodyError
} = require("./middleware/jsonBodyParser");

// Create the Express application instance.
const app = express();

// Render/Vercel sit a proxy in front of the app, so trust the first hop
// for correct req.ip values and any future secure-cookie behaviour.
app.set("trust proxy", 1);

// CORS policy. We accept three classes of origin:
//   1. Anything in CORS_ORIGINS (comma-separated list of explicit origins,
//      or "*" to disable origin checks entirely).
//   2. Any localhost / 127.0.0.1 — for Vite dev servers on any port.
//   3. Any *.vercel.app — so preview deploys and renamed projects work
//      without re-editing env vars on every push.
// Disallowed origins receive a 200 with no CORS headers (silent block);
// the browser blocks the response cleanly instead of seeing a 500-with-HTML.
const explicitOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowAllOrigins = explicitOrigins.includes("*");

function isOriginAllowed(origin) {
  if (!origin) return true;                       // curl, cron, same-origin
  if (allowAllOrigins) return true;
  if (explicitOrigins.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    if (hostname.endsWith(".vercel.app")) return true;
  } catch {
    return false;
  }
  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      // Pass false (not an Error) so the response is a clean 200 with no
      // Access-Control-Allow-Origin header — browser blocks it without the
      // server emitting an HTML 500 page.
      callback(null, isOriginAllowed(origin));
    },
    credentials: true
  })
);

// Parse JSON request bodies while tolerating raw pasted line breaks in strings.
app.use(readJsonBody);
app.use(parseJsonBody);
app.use(express.urlencoded({ extended: true }));

// Health check that also confirms the database is reachable. The cron-job.org
// keep-alive ping uses this to keep the Render free instance warm.
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({
      success: true,
      message: "Work Zone backend is running.",
      database: "connected"
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: "Backend is up but the database is unreachable.",
      database: "disconnected"
    });
  }
});

// Mount all user-related routes under /api/users.
app.use("/api/users", userRoutes);
// Mount all helper-related routes under /api/helpers.
app.use("/api/helpers", helperRoutes);
// Mount shared authentication routes under /api/auth.
app.use("/api/auth", authRoutes);
// Mount plan routes under /api/plans.
app.use("/api/plans", planRoutes);
// Mount booking routes under /api/bookings.
app.use("/api/bookings", bookingRoutes);
// Mount admin routes under /api/admin.
app.use("/api/admin", adminRoutes);

// Return JSON for malformed request bodies instead of an HTML stack trace.
app.use(handleJsonBodyError);

// Return a standard response when a route does not exist.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

// Export the app so server.js can start it.
module.exports = app;
