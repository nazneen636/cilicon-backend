const userModel = require("../models/user.model");
const { customError } = require("../helpers/customError");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
require("../models/permission.modal");
const authgurd = async (req, res) => {
  const aceessToken =
    req?.headers?.authorization?.replace("Bearer ", "") ||
    req?.body?.accessToken ||
    req?.headers?.cookie?.replace("refreshToken=", "");
  const decode = await jwt.verify(aceessToken, process.env.ACCESSTOKEN_SECRET);
  const user = await userModel
    .findById(decode.id)
    .populate("role")
    .populate("permission")
    .select("_id name email image role");
  if (!user) throw new customError(401, "You are unauthorized!");
  console.log(user, "authgard");
};
module.exports = { authgurd };
