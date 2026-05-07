// Import jsonwebtoken so we can verify bearer tokens.
const jwt = require("jsonwebtoken");

// Verify the JWT token and attach the decoded account to req.user.
function authenticateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization || "";
  const token = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required."
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }
}

// Restrict a route to specific account roles.
function authorizeRoles(...allowedRoles) {
  return function checkRoleAccess(req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action."
      });
    }

    return next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};
