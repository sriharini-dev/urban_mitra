// Import bcrypt so we can compare hashed passwords.
const bcrypt = require("bcryptjs");
// Import jsonwebtoken so we can create login tokens.
const jwt = require("jsonwebtoken");
// Import the shared MySQL connection pool.
const pool = require("../../config/db");

// Authenticate an account and create a token.
async function loginAccount(payload) {
  // Extract the login fields from the request body.
  const { email, password } = payload;

  // Find the account by email because all roles use a common login path.
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        full_name,
        email,
        phone,
        password_hash,
        role,
        status
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  // Stop the login flow if no account matches the email.
  if (rows.length === 0) {
    const error = new Error("Account not found.");
    error.code = "ACCOUNT_NOT_FOUND";
    throw error;
  }

  // Use the first matching account.
  const account = rows[0];

  // Compare the entered password with the stored hash.
  const isPasswordValid = await bcrypt.compare(password, account.password_hash);

  // Reject the login if the password is incorrect.
  if (!isPasswordValid) {
    const error = new Error("Invalid password.");
    error.code = "INVALID_PASSWORD";
    throw error;
  }

  // Prevent login when the account is still waiting for approval.
  if (account.status === "pending") {
    const error = new Error("Account pending approval.");
    error.code = "ACCOUNT_PENDING";
    throw error;
  }

  // Prevent login when the account has been blocked.
  if (account.status === "blocked") {
    const error = new Error("Account blocked.");
    error.code = "ACCOUNT_BLOCKED";
    throw error;
  }

  // Create a JWT token that contains the account identity and role.
  const token = jwt.sign(
    {
      id: account.id,
      role: account.role,
      email: account.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  // Return a safe account summary plus the token.
  return {
    token,
    user: {
      id: account.id,
      fullName: account.full_name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      status: account.status
    }
  };
}

// Export service functions.
module.exports = {
  loginAccount
};
