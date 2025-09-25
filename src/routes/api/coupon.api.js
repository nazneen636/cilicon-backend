const express = require("express");
const _ = express.Router();
const couponController = require("../../controller/coupon.contoller");
const { upload } = require("../../middleware/multer.middle");
_.route("/create-review").post(couponController.createCoupon);

module.exports = _;
