// Validate request data for creating a booking.
function validateCreateBooking(payload) {
  const requiredFields = [
    "planId",
    "serviceDate",
    "timeSlot",
    "addressLine",
    "city",
    "pincode"
  ];

  const missingField = findMissingField(requiredFields, payload);
  if (missingField) {
    return `${missingField} is required.`;
  }

  if (!/^\d{6}$/.test(String(payload.pincode))) {
    return "Pincode must contain exactly 6 digits.";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(payload.serviceDate))) {
    return "serviceDate must be in YYYY-MM-DD format.";
  }

  return null;
}

// Validate request data for updating a booking status.
function validateBookingStatusUpdate(payload) {
  const allowedStatuses = ["pending", "confirmed", "assigned", "completed", "cancelled"];

  if (!payload.status) {
    return "status is required.";
  }

  if (!allowedStatuses.includes(payload.status)) {
    return "status is invalid.";
  }

  if (
    payload.helperId !== undefined &&
    payload.helperId !== null &&
    (!Number.isInteger(Number(payload.helperId)) || Number(payload.helperId) <= 0)
  ) {
    return "helperId must be a valid user id.";
  }

  return null;
}

function findMissingField(fields, payload) {
  return fields.find((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });
}

module.exports = {
  validateCreateBooking,
  validateBookingStatusUpdate
};
