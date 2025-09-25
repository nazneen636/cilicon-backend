const { customError } = require("../helpers/customError");
const couponModel = require("../models/coupon.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateCoupon } = require("../validation/coupon.validation");

exports.createCoupon = asyncHandler(async (req, res) => {
  const data = await validateCoupon(req);
  console.log(data);
  if (!data) {
    throw new customError(401, "coupon create failed");
  }
  const coupon = await couponModel.create(data);
  apiResponse.sendSuccess(res, "coupon creates successfully", 201, data);
});

exports.getAllCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponModel.find().sort({ createdAt: -1 });
  if (!coupon || coupon.length === 0) {
    throw new customError(401, "coupon not found");
  }
  apiResponse.sendSuccess(res, "coupon fetch successfully", 201, coupon);
});

exports.singleCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await couponModel.findOne({ _id: id });
  if (!coupon || coupon.length === 0) {
    throw new customError(401, "coupon not found");
  }
  apiResponse.sendSuccess(res, "coupon fetch successfully", 201, coupon);
});

exports.updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await couponModel.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );
  if (!coupon || coupon.length === 0) {
    throw new customError(401, "coupon not found");
  }
  apiResponse.sendSuccess(res, "coupon updated successfully", 201, coupon);
});
