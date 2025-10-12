const { asyncHandler } = require("../utils/asyncHandler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../helpers/customError");
const orderModel = require("../models/order.model");

exports.success = asyncHandler(async (req, res) => {
  console.log(req.body);
  return res.redirect(
    "https://www.simplilearn.com/tutorials/programming-tutorial/what-is-backend-development"
  );
});
exports.fail = asyncHandler(async (req, res) => {
  console.log(req.body);
  return res.redirect(
    "https://www.simplilearn.com/tutorials/programming-tutorial/what-is-backend-development"
  );
});
exports.cancel = asyncHandler(async (req, res) => {
  console.log(req.body);
  return res.redirect(
    "https://www.simplilearn.com/tutorials/programming-tutorial/what-is-backend-development"
  );
});
exports.ipn = asyncHandler(async (req, res) => {
  console.log(req.body);
  return res.redirect(
    "https://www.simplilearn.com/tutorials/programming-tutorial/what-is-backend-development"
  );
});
