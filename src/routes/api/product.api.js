const express = require("express");
const _ = express.Router();
const productController = require("../../controller/product.controller");
const { upload } = require("../../middleware/multer.middle");
_.route("/create-product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.createProduct
);
_.route("/all-product").get(productController.getAllProduct);
_.route("/single-product/:slug").get(productController.getSingleProduct);
_.route("/update-product/:slug").put(productController.updateProduct);
_.route("/update-product-image/:slug").put(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.updateProductImage
);
_.route("/search-product").get(productController.getProducts);
_.route("/price-filter").get(productController.priceFilterProducts);
_.route("/product-pagination").get(productController.productPagination);
module.exports = _;
