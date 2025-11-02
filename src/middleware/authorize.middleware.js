const { customError } = require("../helpers/customError");
const { asyncHandler } = require("../utils/asyncHandler");
exports.autorize = (action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new customError(401, "Unauthorized");
      }
    } catch (error) {
      // console.log(error);
    }
  };
};
