const express = require("express");
const _ = express.Router();
const cartController = require("../../controller/cart.controller");
_.route("/addtocart").post(cartController.createCart);
// _.route("/all-coupon").get(couponController.getAllCoupon);
// _.route("/single-coupon/:id").get(couponController.singleCoupon);
// _.route("/update-coupon/:id").put(couponController.updateCoupon);

module.exports = _;
