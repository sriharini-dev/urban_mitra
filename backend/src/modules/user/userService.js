// Import bcrypt so passwords can be securely hashed.
const bcrypt = require("bcryptjs");
// Import the shared MySQL connection pool.
const pool = require("../../config/db");

// Create a normal customer account.
async function createUserAccount(payload) {
  // Extract only the fields needed for a customer account.
  const {
    fullName,
    email,
    phone,
    password,
    addressLine,
    city,
    pincode
  } = payload;

  // Ensure the email and phone number are not already in use.
  await ensureUniqueIdentity(email, phone);

  // Hash the password before saving it.
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert the customer record into the users table.
  const [result] = await pool.execute(
    `
      INSERT INTO users
        (full_name, email, phone, password_hash, role, status, address_line, city, pincode)
      VALUES
        (?, ?, ?, ?, 'user', 'active', ?, ?, ?)
    `,
    [fullName, email, phone, passwordHash, addressLine, city, pincode]
  );

  // Return only safe fields to the API caller.
  return {
    id: result.insertId,
    fullName,
    email,
    phone,
    role: "user",
    status: "active"
  };
}

// Check whether the provided email or phone already exists.
async function ensureUniqueIdentity(email, phone) {
  // Look for an existing account with the same email.
  const [emailRows] = await pool.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  // Throw a named error so the controller can return 409.
  if (emailRows.length > 0) {
    const error = new Error("Email already exists.");
    error.code = "DUPLICATE_EMAIL";
    throw error;
  }

  // Look for an existing account with the same phone number.
  const [phoneRows] = await pool.execute(
    "SELECT id FROM users WHERE phone = ? LIMIT 1",
    [phone]
  );

  // Throw a named error if the phone is already taken.
  if (phoneRows.length > 0) {
    const error = new Error("Phone already exists.");
    error.code = "DUPLICATE_PHONE";
    throw error;
  }
}

// Export service functions.
module.exports = {
  createUserAccount
};
