// Reuse common validation helpers from the user module.
const {
  validateCommonPasswordRules,
  findMissingField,
  isValidEmail,
  isValidPhone,
  isValidPincode
} = require("../user/userValidator");

// Validate request data for helper signup.
function validateHelperSignup(payload) {
  // Helpers need the normal user fields plus helper-specific fields.
  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "password",
    "confirmPassword",
    "addressLine",
    "city",
    "pincode",
    "gender",
    "dateOfBirth",
    "skills",
    "experienceYears",
    "availability",
    "idProofType",
    "idProofNumber"
  ];

  // Find the first required field that is missing.
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

  // A helper must provide at least one supported skill.
  if (!Array.isArray(payload.skills) || payload.skills.length === 0) {
    return "At least one skill is required for helper signup.";
  }

  // Experience cannot be negative.
  if (Number(payload.experienceYears) < 0) {
    return "Experience years cannot be negative.";
  }

  // Return null when validation passes.
  return null;
}

// Export helper validation.
module.exports = {
  validateHelperSignup
};
