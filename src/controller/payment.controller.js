const { asyncHandler } = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");
const { customError } = require("../helpers/customError");
const orderModel = require("../models/order.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_API_KEY;
const is_live = process.env.NODE_ENV == "development" ? false : true;

exports.success = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { val_id } = req.body;

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const data = await sslcz.validate({ val_id });
  const { tran_id, status } = data;

  await orderModel.findOneAndUpdate(
    { transactionId: tran_id },
    {
      paymentStatus: status == "VALID" && "success",
      paymentInfo: data,
      valId: status, 
      orderStatus: "confirmed",
    }
  );
  apiResponse.sendSuccess(res, "payment successful", 200, null);
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
