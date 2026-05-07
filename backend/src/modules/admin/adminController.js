// Import the service that contains admin business logic.
const adminService = require("./adminService");
// Import the validator for admin helper actions.
const { validateHelperStatusUpdate } = require("./adminValidator");

// Return dashboard counts for admin screens.
async function getOverview(req, res) {
  try {
    const overview = await adminService.getDashboardOverview();

    return res.status(200).json({
      success: true,
      data: overview
    });
  } catch (error) {
    return handleAdminError(error, res);
  }
}

// Return helper accounts, optionally filtered by status.
async function getHelpers(req, res) {
  try {
    const helpers = await adminService.listHelpers(req.query.status);

    return res.status(200).json({
      success: true,
      data: helpers
    });
  } catch (error) {
    return handleAdminError(error, res);
  }
}

// Update helper approval status.
async function updateHelperStatus(req, res) {
  try {
    const validationError = validateHelperStatusUpdate(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const updatedHelper = await adminService.updateHelperStatus(
      req.params.id,
      req.body.status
    );

    return res.status(200).json({
      success: true,
      message: "Helper status updated successfully.",
      data: updatedHelper
    });
  } catch (error) {
    return handleAdminError(error, res);
  }
}

function handleAdminError(error, res) {
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
  getOverview,
  getHelpers,
  updateHelperStatus
};
