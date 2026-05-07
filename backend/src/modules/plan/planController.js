// Import the service that contains plan business logic.
const planService = require("./planService");
// Import the validator that checks plan creation input.
const { validateCreatePlan } = require("./planValidator");

// Return the available active plans.
async function getPlans(req, res) {
  try {
    const plans = await planService.listActivePlans();

    return res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    return handlePlanError(error, res);
  }
}

// Create a new service plan.
async function createPlan(req, res) {
  try {
    const validationError = validateCreatePlan(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const createdPlan = await planService.createPlan(req.body);

    return res.status(201).json({
      success: true,
      message: "Plan created successfully.",
      data: createdPlan
    });
  } catch (error) {
    return handlePlanError(error, res);
  }
}

function handlePlanError(error, res) {
  if (error.code === "DUPLICATE_PLAN_NAME") {
    return res.status(409).json({
      success: false,
      message: "Plan name already exists."
    });
  }

  if (error.code === "ECONNREFUSED") {
    return res.status(500).json({
      success: false,
      message: "Database connection failed. Check whether MySQL is running."
    });
  }

  if (error.code === "ER_ACCESS_DENIED_ERROR") {
    return res.status(500).json({
      success: false,
      message: "Database login failed. Check DB_USER and DB_PASSWORD in backend/.env."
    });
  }

  if (error.code === "ER_BAD_DB_ERROR") {
    return res.status(500).json({
      success: false,
      message: "Database work_zone was not found. Run backend/database/schema.sql first."
    });
  }

  if (error.code === "ER_NO_SUCH_TABLE") {
    return res.status(500).json({
      success: false,
      message: "Required database tables are missing. Run backend/database/schema.sql first."
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Something went wrong while processing the request."
  });
}

module.exports = {
  getPlans,
  createPlan
};
