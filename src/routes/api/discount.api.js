const express = require("express");
const _ = express.Router();
const discountController = require("../../controller/discount.controller");
_.route("/create-discount").post(discountController.createDiscount);
_.route("/all-discount").get(discountController.getAllDiscount);
_.route("/single-discount/:slug").get(discountController.singleDiscount);
_.route("/update-discount/:slug").put(discountController.updateDiscount);

module.exports = _;
