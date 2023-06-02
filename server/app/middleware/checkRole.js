const { AccessError } = require("../utils/errorClasses");

module.exports = checkRole = (requiredRole) => {
  return async function (req, res, next) {
    try {
      const userRoles = (
        await req.user.getRoles({ attributes: ["role_name"] })
      ).map((role) => role.role_name);
      if (!userRoles.includes(requiredRole)) {
        throw new AccessError("No required role to access the resource");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
