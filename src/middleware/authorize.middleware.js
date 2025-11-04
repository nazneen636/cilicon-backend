const { customError } = require("../helpers/customError");
const { asyncHandler } = require("../utils/asyncHandler");
exports.autorize = (requiredAction) => {
  return async (req, res, next) => {
    try {
      console.log("Authorize middleware started");
      if (!req.user) {
        throw new customError(401, "Unauthorized");
      }
      const isAuthorized = req.user.permission.find(
        (p) => p.permissionId.slug === requiredAction
      );
      if (!isAuthorized) {
        throw new customError(401, "Unauthorized access permission denied");
      }
      if (!isAuthorized?.action?.includes(requiredAction)) {
        throw new customError(401, "Unauthorized access permission denied");
      }
      console.log(req.user.permission, "isAuthorized");

      console.log(isAuthorized.action.includes(req), "auth");
    } catch (error) {
      next(error);
    }
  };
};
