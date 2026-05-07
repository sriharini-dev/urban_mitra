// Import Express so we can define admin routes.
const express = require("express");
// Import the controller that handles admin requests.
const adminController = require("./adminController");
// Import auth middleware for protected admin access.
const {
  authenticateToken,
  authorizeRoles
} = require("../../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("admin"));

// Dashboard summary counts for admin screens.
router.get("/overview", adminController.getOverview);

// Review helper applications and existing helper accounts.
router.get("/helpers", adminController.getHelpers);

// Approve, block, or move a helper back to pending.
router.patch("/helpers/:id/status", adminController.updateHelperStatus);

module.exports = router;
