// Import Express to create the web server.
const express = require("express");
// Import user signup routes.
const userRoutes = require("./modules/user/userRoutes");
// Import helper signup routes.
const helperRoutes = require("./modules/helper/helperRoutes");
// Import shared login routes.
const authRoutes = require("./modules/auth/authRoutes");

// Create the Express application instance.
const app = express();

// Parse JSON request bodies so controllers can read req.body.
app.use(express.json());

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

// Return a standard response when a route does not exist.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

// Export the app so server.js can start it.
module.exports = app;
