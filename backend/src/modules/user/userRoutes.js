// Import Express so we can define user-related routes.
const express = require("express");
// Import the controller that handles user signup requests.
const userController = require("./userController");

// Create a router for user endpoints.
const router = express.Router();

// Public route for customer signup.
router.post("/signup", userController.signupUser);

// Export the router so app.js can mount it.
module.exports = router;
