// Import the shared MySQL connection pool.
const pool = require("../../config/db");

// Return high-level counts for an admin dashboard.
async function getDashboardOverview() {
  const [[userCounts]] = await pool.execute(
    `
      SELECT
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) AS total_users,
        SUM(CASE WHEN role = 'helper' THEN 1 ELSE 0 END) AS total_helpers,
        SUM(CASE WHEN role = 'helper' AND status = 'pending' THEN 1 ELSE 0 END) AS pending_helpers
      FROM users
    `
  );

  const [[planCounts]] = await pool.execute(
    `
      SELECT
        COUNT(*) AS total_plans,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) AS active_plans
      FROM plans
    `
  );

  const [[bookingCounts]] = await pool.execute(
    `
      SELECT
        COUNT(*) AS total_bookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_bookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_bookings
      FROM bookings
    `
  );

  return {
    users: {
      totalUsers: Number(userCounts.total_users || 0),
      totalHelpers: Number(userCounts.total_helpers || 0),
      pendingHelpers: Number(userCounts.pending_helpers || 0)
    },
    plans: {
      totalPlans: Number(planCounts.total_plans || 0),
      activePlans: Number(planCounts.active_plans || 0)
    },
    bookings: {
      totalBookings: Number(bookingCounts.total_bookings || 0),
      pendingBookings: Number(bookingCounts.pending_bookings || 0),
      completedBookings: Number(bookingCounts.completed_bookings || 0)
    }
  };
}

// Return helper accounts for admin review.
async function listHelpers(status) {
  let query = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.phone,
      u.status,
      u.city,
      u.pincode,
      h.gender,
      h.date_of_birth,
      h.skills,
      h.experience_years,
      h.availability,
      h.id_proof_type,
      h.id_proof_number,
      h.about
    FROM users u
    INNER JOIN helper_profiles h ON h.user_id = u.id
    WHERE u.role = 'helper'
  `;
  const params = [];

  if (status) {
    query += " AND u.status = ?";
    params.push(status);
  }

  query += " ORDER BY u.created_at DESC, u.id DESC";

  const [rows] = await pool.execute(query, params);
  return rows.map(mapHelperRow);
}

// Update helper approval state from the admin panel.
async function updateHelperStatus(helperId, status) {
  const [result] = await pool.execute(
    `
      UPDATE users
      SET status = ?
      WHERE id = ? AND role = 'helper'
    `,
    [status, Number(helperId)]
  );

  if (result.affectedRows === 0) {
    const error = new Error("Helper not found.");
    error.code = "HELPER_NOT_FOUND";
    throw error;
  }

  const [rows] = await pool.execute(
    `
      SELECT id, full_name, email, phone, role, status
      FROM users
      WHERE id = ? AND role = 'helper'
      LIMIT 1
    `,
    [Number(helperId)]
  );

  return {
    id: rows[0].id,
    fullName: rows[0].full_name,
    email: rows[0].email,
    phone: rows[0].phone,
    role: rows[0].role,
    status: rows[0].status
  };
}

function mapHelperRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    city: row.city,
    pincode: row.pincode,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    // mysql2 v3 auto-parses JSON columns, so row.skills is already an array.
    skills: row.skills,
    experienceYears: row.experience_years,
    availability: row.availability,
    idProofType: row.id_proof_type,
    idProofNumber: row.id_proof_number,
    about: row.about
  };
}

module.exports = {
  getDashboardOverview,
  listHelpers,
  updateHelperStatus
};
