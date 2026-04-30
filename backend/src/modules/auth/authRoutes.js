// Import Express so we can define authentication routes.
const express = require("express");
// Import the controller that handles login requests.
const authController = require("./authController");

// Create a router for auth endpoints.
const router = express.Router();

// Shared login route for admin, user, and helper accounts.
router.post("/login", authController.login);

// Export the router so app.js can mount it.
module.exports = router;
