// Import the service that contains user signup business logic.
const userService = require("./userService");
// Import the validator that checks user signup data.
const { validateUserSignup } = require("./userValidator");

// Handle customer signup requests.
async function signupUser(req, res) {
  try {
    // Validate the incoming request body before talking to the database.
    const validationError = validateUserSignup(req.body);

    // Return a client error if validation fails.
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    // Create the user account through the service layer.
    const createdUser = await userService.createUserAccount(req.body);

    // Send the final success response.
    return res.status(201).json({
      success: true,
      message: "User account created successfully.",
      data: createdUser
    });
  } catch (error) {
    return handleUserSignupError(error, res);
  }
}

// Convert service-layer errors into HTTP responses.
function handleUserSignupError(error, res) {
  // Email must be unique across accounts.
  if (error.code === "DUPLICATE_EMAIL") {
    return res.status(409).json({
      success: false,
      message: "Email is already registered."
    });
  }

  // Phone must also be unique.
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

  // The required table is missing.
  if (error.code === "ER_NO_SUCH_TABLE") {
    return res.status(500).json({
      success: false,
      message: "Required database tables are missing. Run backend/database/schema.sql first."
    });
  }

  // Log unexpected server errors for debugging.
  console.error(error);

  // Return a generic internal server error to the client.
  return res.status(500).json({
    success: false,
    message: "Something went wrong while processing the request."
  });
}

// Export controller functions.
module.exports = {
  signupUser
};
