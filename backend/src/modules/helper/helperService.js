// Import bcrypt so helper passwords can be hashed securely.
const bcrypt = require("bcryptjs");
// Import the shared MySQL connection pool.
const pool = require("../../config/db");

// Create a helper account and its helper profile.
async function createHelperAccount(payload) {
  // Extract the fields required for helper signup.
  const {
    fullName,
    email,
    phone,
    password,
    addressLine,
    city,
    pincode,
    gender,
    dateOfBirth,
    skills,
    experienceYears,
    availability,
    idProofType,
    idProofNumber,
    about
  } = payload;

  // Ensure the email and phone number are unique before inserting data.
  await ensureUniqueIdentity(email, phone);

  // Hash the helper password before storing it.
  const passwordHash = await bcrypt.hash(password, 10);
  // Get a dedicated connection because we need a transaction.
  const connection = await pool.getConnection();

  try {
    // Start a transaction so both inserts succeed or fail together.
    await connection.beginTransaction();

    // Insert the shared account record into the users table.
    const [userResult] = await connection.execute(
      `
        INSERT INTO users
          (full_name, email, phone, password_hash, role, status, address_line, city, pincode)
        VALUES
          (?, ?, ?, ?, 'helper', 'pending', ?, ?, ?)
      `,
      [fullName, email, phone, passwordHash, addressLine, city, pincode]
    );

    // Insert helper-specific details into helper_profiles.
    await connection.execute(
      `
        INSERT INTO helper_profiles
          (user_id, gender, date_of_birth, skills, experience_years, availability, id_proof_type, id_proof_number, about)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userResult.insertId,
        gender,
        dateOfBirth,
        JSON.stringify(skills),
        experienceYears,
        availability,
        idProofType,
        idProofNumber,
        about || null
      ]
    );

    // Save both inserts permanently.
    await connection.commit();

    // Return only the safe summary data.
    return {
      id: userResult.insertId,
      fullName,
      email,
      phone,
      role: "helper",
      status: "pending"
    };
  } catch (error) {
    // Undo changes if any query fails.
    await connection.rollback();
    throw error;
  } finally {
    // Release the connection back to the pool.
    connection.release();
  }
}

// Check whether the provided email or phone already exists.
async function ensureUniqueIdentity(email, phone) {
  // Check whether another account already uses this email.
  const [emailRows] = await pool.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  // Throw a named error so the controller can send 409 Conflict.
  if (emailRows.length > 0) {
    const error = new Error("Email already exists.");
    error.code = "DUPLICATE_EMAIL";
    throw error;
  }

  // Check whether another account already uses this phone number.
  const [phoneRows] = await pool.execute(
    "SELECT id FROM users WHERE phone = ? LIMIT 1",
    [phone]
  );

  // Throw a named error if the phone number is already registered.
  if (phoneRows.length > 0) {
    const error = new Error("Phone already exists.");
    error.code = "DUPLICATE_PHONE";
    throw error;
  }
}

// Export service functions.
module.exports = {
  createHelperAccount
};
