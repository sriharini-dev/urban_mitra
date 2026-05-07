// Import Express so we can define plan routes.
const express = require("express");
// Import the controller that handles plan requests.
const planController = require("./planController");
// Import auth middleware for protected routes.
const {
  authenticateToken,
  authorizeRoles
} = require("../../middleware/authMiddleware");

const router = express.Router();

// Public route to browse active plans.
router.get("/", planController.getPlans);

// Admin-only route to create a new plan.
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  planController.createPlan
);

module.exports = router;
