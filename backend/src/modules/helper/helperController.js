// Import the service that contains helper signup business logic.
const helperService = require("./helperService");
// Import the validator that checks helper signup data.
const { validateHelperSignup } = require("./helperValidator");

// Handle helper signup requests.
async function signupHelper(req, res) {
  try {
    // Validate the helper signup input before any database queries run.
    const validationError = validateHelperSignup(req.body);

    // Return a client error when the form data is invalid.
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    // Create the helper account and related helper profile.
    const createdHelper = await helperService.createHelperAccount(req.body);

    // Return a success response and explain that approval is still pending.
    return res.status(201).json({
      success: true,
      message: "Helper signup submitted. Awaiting admin verification.",
      data: createdHelper
    });
  } catch (error) {
    return handleHelperSignupError(error, res);
  }
}

// Convert service errors into clear API responses.
function handleHelperSignupError(error, res) {
  // Email must be unique across the system.
  if (error.code === "DUPLICATE_EMAIL") {
    return res.status(409).json({
      success: false,
      message: "Email is already registered."
    });
  }

  // Phone number must also be unique.
  if (error.code === "DUPLICATE_PHONE") {
    return res.status(409).json({
      success: false,
      message: "Phone number is already registered."
    });
  }

  // MySQL is not running or the host/port is wrong.
  if (error.code === "ECONNREFUSED") {
    return res.status(500).json({
      success: false,
      message: "Database connection failed. Check whether MySQL is running."
    });
  }

  // MySQL credentials in .env are invalid.
  if (error.code === "ER_ACCESS_DENIED_ERROR") {
    return res.status(500).json({
      success: false,
      message: "Database login failed. Check DB_USER and DB_PASSWORD in backend/.env."
    });
  }

  // The configured database has not been created yet.
  if (error.code === "ER_BAD_DB_ERROR") {
    return res.status(500).json({
      success: false,
      message: "Database work_zone was not found. Run backend/database/schema.sql first."
    });
  }

  // The required tables are missing.
  if (error.code === "ER_NO_SUCH_TABLE") {
    return res.status(500).json({
      success: false,
      message: "Required database tables are missing. Run backend/database/schema.sql first."
    });
  }

  // Print unexpected errors for debugging.
  console.error(error);

  // Return a generic server error response.
  return res.status(500).json({
    success: false,
    message: "Something went wrong while processing the request."
  });
}

// Export controller functions.
module.exports = {
  signupHelper
};
