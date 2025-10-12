const express = require("express");
const _ = express.Router();
const paymentController = require("../../controller/payment.controller");
_.route("/success").post(paymentController.success);
_.route("/fail").post(paymentController.getAllCoupon);
_.route("/cancel").post(paymentController.singleCoupon);
_.route("/ipn").post(paymentController.updateCoupon);

module.exports = _;
