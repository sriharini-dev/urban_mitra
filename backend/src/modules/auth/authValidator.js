// Validate login input shared by admin, user, and helper accounts.
function validateLogin(payload) {
  // Email is required to identify the account.
  if (!payload.email) {
    return "email is required.";
  }

  // Password is required to verify the account.
  if (!payload.password) {
    return "password is required.";
  }

  // Check whether the email format is valid.
  if (!isValidEmail(payload.email)) {
    return "Please enter a valid email address.";
  }

  // Return null when validation passes.
  return null;
}

// Basic email format validation.
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Export validator functions.
module.exports = {
  validateLogin
};
