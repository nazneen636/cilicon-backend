const { customError } = require("../helpers/customError");
const orderModel = require("../models/order.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateBrand } = require("../validation/brand.validation");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

exports.createOrder = asyncHandler(async (req, res) => {
  if (!brand) {
    throw new customError(500, "brand create failed");
  }
  apiResponse.sendSuccess(res, "brand created successfully", 200, brand);
  await brand.save();
});
