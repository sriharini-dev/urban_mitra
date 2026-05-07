// Validate request data for creating a service plan.
function validateCreatePlan(payload) {
  const requiredFields = [
    "name",
    "price",
    "durationDays",
    "visitsPerMonth",
    "features"
  ];

  const missingField = findMissingField(requiredFields, payload);
  if (missingField) {
    return `${missingField} is required.`;
  }

  if (Number(payload.price) <= 0) {
    return "Price must be greater than zero.";
  }

  if (!Number.isInteger(Number(payload.durationDays)) || Number(payload.durationDays) <= 0) {
    return "durationDays must be a positive whole number.";
  }

  if (!Number.isInteger(Number(payload.visitsPerMonth)) || Number(payload.visitsPerMonth) <= 0) {
    return "visitsPerMonth must be a positive whole number.";
  }

  if (!Array.isArray(payload.features) || payload.features.length === 0) {
    return "At least one feature is required.";
  }

  return null;
}

function findMissingField(fields, payload) {
  return fields.find((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });
}

module.exports = {
  validateCreatePlan
};
