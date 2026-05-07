// Validate helper status changes made by admin.
function validateHelperStatusUpdate(payload) {
  const allowedStatuses = ["pending", "active", "blocked"];

  if (!payload.status) {
    return "status is required.";
  }

  if (!allowedStatuses.includes(payload.status)) {
    return "status is invalid.";
  }

  return null;
}

module.exports = {
  validateHelperStatusUpdate
};
