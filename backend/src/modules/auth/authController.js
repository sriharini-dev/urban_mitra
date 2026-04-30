// Import the service that contains login business logic.
const authService = require("./authService");
// Import the validator that checks login input.
const { validateLogin } = require("./authValidator");

// Handle login requests for all roles.
async function login(req, res) {
  try {
    // Validate the login request body before querying the database.
    const validationError = validateLogin(req.body);

    // Return a client error if the request body is invalid.
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    // Authenticate the account and generate a JWT token.
    const loginResult = await authService.loginAccount(req.body);

    // Return the authenticated account summary and token.
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      ...loginResult
    });
  } catch (error) {
    return handleLoginError(error, res);
  }
}

// Convert service errors into clean API responses.
function handleLoginError(error, res) {
  // Email not found in the database.
  if (error.code === "ACCOUNT_NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: "Account not found."
    });
  }

  // Password does not match the stored hash.
  if (error.code === "INVALID_PASSWORD") {
    return res.status(401).json({
      success: false,
      message: "Invalid password."
    });
  }

  // Helpers or other accounts may be waiting for approval.
  if (error.code === "ACCOUNT_PENDING") {
    return res.status(403).json({
      success: false,
      message: "Your account is pending admin approval."
    });
  }

  // Blocked accounts should not be allowed to login.
  if (error.code === "ACCOUNT_BLOCKED") {
    return res.status(403).json({
      success: false,
      message: "Your account has been blocked. Please contact support."
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

  // JWT secret must exist before login can create tokens.
  if (error.message === "secretOrPrivateKey must have a value") {
    return res.status(500).json({
      success: false,
      message: "JWT secret is missing. Check JWT_SECRET in backend/.env."
    });
  }

  // Print unexpected server errors for debugging.
  console.error(error);

  // Return a generic 500 response for unknown failures.
  return res.status(500).json({
    success: false,
    message: "Something went wrong while processing the request."
  });
}

// Export controller functions.
module.exports = {
  login
};
