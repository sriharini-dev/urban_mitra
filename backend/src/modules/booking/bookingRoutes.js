// Import Express so we can define booking routes.
const express = require("express");
// Import the controller that handles booking requests.
const bookingController = require("./bookingController");
// Import auth middleware for protected access.
const {
  authenticateToken,
  authorizeRoles
} = require("../../middleware/authMiddleware");

const router = express.Router();

// Create a booking as a normal user.
router.post(
  "/",
  authenticateToken,
  authorizeRoles("user"),
  bookingController.createBooking
);

// Return bookings visible to the authenticated account.
router.get(
  "/my",
  authenticateToken,
  authorizeRoles("user", "helper", "admin"),
  bookingController.getMyBookings
);

// Admin route to assign helpers or move booking status forward.
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin"),
  bookingController.updateBookingStatus
);

module.exports = router;
