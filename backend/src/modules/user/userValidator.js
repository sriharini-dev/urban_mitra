// Validate request data for customer signup.
function validateUserSignup(payload) {
  // These fields are required for every customer account.
  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "password",
    "confirmPassword",
    "addressLine",
    "city",
    "pincode"
  ];

  // Find the first missing field.
  const missingField = findMissingField(requiredFields, payload);
  if (missingField) {
    return `${missingField} is required.`;
  }

  // Validate password and confirm password values.
  const passwordMessage = validateCommonPasswordRules(
    payload.password,
    payload.confirmPassword
  );
  if (passwordMessage) {
    return passwordMessage;
  }

  // Validate email format.
  if (!isValidEmail(payload.email)) {
    return "Please enter a valid email address.";
  }

  // Validate a 10-digit phone number.
  if (!isValidPhone(payload.phone)) {
    return "Phone number must contain exactly 10 digits.";
  }

  // Validate a 6-digit pincode.
  if (!isValidPincode(payload.pincode)) {
    return "Pincode must contain exactly 6 digits.";
  }

  // Return null when validation passes.
  return null;
}

// Validate rules shared by user and helper passwords.
function validateCommonPasswordRules(password, confirmPassword) {
  // Password and confirm password must match.
  if (password !== confirmPassword) {
    return "Password and confirm password must match.";
  }

  // Require a minimum password length.
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return null;
}

// Return the first required field that is missing or empty.
function findMissingField(fields, payload) {
  return fields.find((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });
}

// Check whether the email looks valid.
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Check whether the phone number has exactly 10 digits.
function isValidPhone(phone) {
  return /^\d{10}$/.test(String(phone));
}

// Check whether the pincode has exactly 6 digits.
function isValidPincode(pincode) {
  return /^\d{6}$/.test(String(pincode));
}

// Export validation functions.
module.exports = {
  validateUserSignup,
  validateCommonPasswordRules,
  findMissingField,
  isValidEmail,
  isValidPhone,
  isValidPincode
};
