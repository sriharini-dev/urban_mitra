// Import Express so we can define helper-related routes.
const express = require("express");
// Import the controller that handles helper signup requests.
const helperController = require("./helperController");

// Create a router for helper endpoints.
const router = express.Router();

// Public route for helper signup.
router.post("/signup", helperController.signupHelper);

// Export the router so app.js can mount it.
module.exports = router;
