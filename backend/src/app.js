// Import Express to create the web server.
const express = require("express");
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

// Parse JSON request bodies while tolerating raw pasted line breaks in strings.
app.use(readJsonBody);
app.use(parseJsonBody);
app.use(express.urlencoded({ extended: true }));

// A simple test route to confirm that the backend server is running.
app.get("/api/health", (req, res) => {
  // Send a success response back to the client.
  res.json({
    success: true,
    message: "Work Zone backend is running."
  });
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
