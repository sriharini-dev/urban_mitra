// Import the shared MySQL connection pool.
const pool = require("../../config/db");

// Create a booking for an authenticated user.
async function createBooking(payload, currentUser) {
  const {
    planId,
    serviceDate,
    timeSlot,
    notes,
    addressLine,
    city,
    pincode
  } = payload;

  await ensurePlanExists(planId);

  const [result] = await pool.execute(
    `
      INSERT INTO bookings
        (user_id, plan_id, service_date, time_slot, notes, address_line, city, pincode, status)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `,
    [
      currentUser.id,
      Number(planId),
      serviceDate,
      timeSlot,
      notes || null,
      addressLine,
      city,
      pincode
    ]
  );

  return getBookingById(result.insertId);
}

// Return bookings visible to the current authenticated account.
async function listBookingsForUser(currentUser) {
  let query = `
    SELECT
      b.id,
      b.user_id,
      b.helper_id,
      b.plan_id,
      p.name AS plan_name,
      b.service_date,
      b.time_slot,
      b.notes,
      b.address_line,
      b.city,
      b.pincode,
      b.status,
      b.created_at,
      b.updated_at
    FROM bookings b
    INNER JOIN plans p ON p.id = b.plan_id
  `;
  let params = [];

  if (currentUser.role === "user") {
    query += " WHERE b.user_id = ?";
    params = [currentUser.id];
  } else if (currentUser.role === "helper") {
    query += " WHERE b.helper_id = ?";
    params = [currentUser.id];
  }

  query += " ORDER BY b.service_date DESC, b.id DESC";

  const [rows] = await pool.execute(query, params);
  return rows.map(mapBookingRow);
}

// Update booking status and optional helper assignment.
async function updateBookingStatus(bookingId, payload) {
  const booking = await getRawBookingById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found.");
    error.code = "BOOKING_NOT_FOUND";
    throw error;
  }

  const helperId =
    payload.helperId === undefined ? booking.helper_id : Number(payload.helperId);

  if (helperId !== null) {
    await ensureHelperExists(helperId);
  }

  await pool.execute(
    `
      UPDATE bookings
      SET helper_id = ?, status = ?
      WHERE id = ?
    `,
    [helperId, payload.status, Number(bookingId)]
  );

  return getBookingById(bookingId);
}

async function getBookingById(bookingId) {
  const [rows] = await pool.execute(
    `
      SELECT
        b.id,
        b.user_id,
        b.helper_id,
        b.plan_id,
        p.name AS plan_name,
        b.service_date,
        b.time_slot,
        b.notes,
        b.address_line,
        b.city,
        b.pincode,
        b.status,
        b.created_at,
        b.updated_at
      FROM bookings b
      INNER JOIN plans p ON p.id = b.plan_id
      WHERE b.id = ?
      LIMIT 1
    `,
    [Number(bookingId)]
  );

  return rows.length > 0 ? mapBookingRow(rows[0]) : null;
}

async function getRawBookingById(bookingId) {
  const [rows] = await pool.execute(
    "SELECT id, helper_id FROM bookings WHERE id = ? LIMIT 1",
    [Number(bookingId)]
  );

  return rows[0] || null;
}

async function ensurePlanExists(planId) {
  const [rows] = await pool.execute(
    "SELECT id FROM plans WHERE id = ? AND is_active = TRUE LIMIT 1",
    [Number(planId)]
  );

  if (rows.length === 0) {
    const error = new Error("Plan not found.");
    error.code = "PLAN_NOT_FOUND";
    throw error;
  }
}

async function ensureHelperExists(helperId) {
  const [rows] = await pool.execute(
    "SELECT id FROM users WHERE id = ? AND role = 'helper' LIMIT 1",
    [Number(helperId)]
  );

  if (rows.length === 0) {
    const error = new Error("Helper not found.");
    error.code = "HELPER_NOT_FOUND";
    throw error;
  }
}

function mapBookingRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    helperId: row.helper_id,
    planId: row.plan_id,
    planName: row.plan_name,
    serviceDate: row.service_date,
    timeSlot: row.time_slot,
    notes: row.notes,
    addressLine: row.address_line,
    city: row.city,
    pincode: row.pincode,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = {
  createBooking,
  listBookingsForUser,
  updateBookingStatus
};
