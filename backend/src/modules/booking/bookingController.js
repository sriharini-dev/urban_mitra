// Import the service that contains booking business logic.
const bookingService = require("./bookingService");
// Import validators for booking input.
const {
  validateCreateBooking,
  validateBookingStatusUpdate
} = require("./bookingValidator");

// Create a new booking for the authenticated user.
async function createBooking(req, res) {
  try {
    const validationError = validateCreateBooking(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const createdBooking = await bookingService.createBooking(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: createdBooking
    });
  } catch (error) {
    return handleBookingError(error, res);
  }
}

// Return bookings that belong to the authenticated account.
async function getMyBookings(req, res) {
  try {
    const bookings = await bookingService.listBookingsForUser(req.user);

    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    return handleBookingError(error, res);
  }
}

// Update booking status from admin workflows.
async function updateBookingStatus(req, res) {
  try {
    const validationError = validateBookingStatusUpdate(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const updatedBooking = await bookingService.updateBookingStatus(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      data: updatedBooking
    });
  } catch (error) {
    return handleBookingError(error, res);
  }
}

function handleBookingError(error, res) {
  if (error.code === "PLAN_NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: "Selected plan was not found."
    });
  }

  if (error.code === "BOOKING_NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: "Booking not found."
    });
  }

  if (error.code === "HELPER_NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: "Helper account was not found."
    });
  }

  if (error.code === "ECONNREFUSED") {
    return res.status(500).json({
      success: false,
      message: "Database connection failed. Check whether MySQL is running."
    });
  }

  if (error.code === "ER_ACCESS_DENIED_ERROR") {
    return res.status(500).json({
      success: false,
      message: "Database login failed. Check DB_USER and DB_PASSWORD in backend/.env."
    });
  }

  if (error.code === "ER_BAD_DB_ERROR") {
    return res.status(500).json({
      success: false,
      message: "Database work_zone was not found. Run backend/database/schema.sql first."
    });
  }

  if (error.code === "ER_NO_SUCH_TABLE") {
    return res.status(500).json({
      success: false,
      message: "Required database tables are missing. Run backend/database/schema.sql first."
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Something went wrong while processing the request."
  });
}

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};
