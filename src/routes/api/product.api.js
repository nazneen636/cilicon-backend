const express = require("express");
const _ = express.Router();
const productController = require("../../controller/product.controller");
const { upload } = require("../../middleware/multer.middle");
_.route("/create-product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.createProduct
);
_.route("/all-product").get(productController.getAllProduct);
module.exports = _;
_.route("/single-product/:slug").get(productController.getSingleProduct);
module.exports = _;
