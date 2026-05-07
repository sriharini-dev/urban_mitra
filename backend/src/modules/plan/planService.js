// Import the shared MySQL connection pool.
const pool = require("../../config/db");

// Return all active plans ordered by price.
async function listActivePlans() {
  const [rows] = await pool.execute(
    `
      SELECT id, name, description, price, duration_days, visits_per_month, features, is_active
      FROM plans
      WHERE is_active = TRUE
      ORDER BY price ASC, id ASC
    `
  );

  return rows.map(mapPlanRow);
}

// Create a new service plan.
async function createPlan(payload) {
  const {
    name,
    description,
    price,
    durationDays,
    visitsPerMonth,
    features
  } = payload;

  const [existingRows] = await pool.execute(
    "SELECT id FROM plans WHERE name = ? LIMIT 1",
    [name]
  );

  if (existingRows.length > 0) {
    const error = new Error("Plan already exists.");
    error.code = "DUPLICATE_PLAN_NAME";
    throw error;
  }

  const [result] = await pool.execute(
    `
      INSERT INTO plans
        (name, description, price, duration_days, visits_per_month, features, is_active)
      VALUES
        (?, ?, ?, ?, ?, ?, TRUE)
    `,
    [
      name,
      description || null,
      Number(price),
      Number(durationDays),
      Number(visitsPerMonth),
      JSON.stringify(features)
    ]
  );

  return {
    id: result.insertId,
    name,
    description: description || null,
    price: Number(price),
    durationDays: Number(durationDays),
    visitsPerMonth: Number(visitsPerMonth),
    features,
    isActive: true
  };
}

function mapPlanRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    durationDays: row.duration_days,
    visitsPerMonth: row.visits_per_month,
    features: JSON.parse(row.features),
    isActive: Boolean(row.is_active)
  };
}

module.exports = {
  listActivePlans,
  createPlan
};
