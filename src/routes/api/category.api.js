const express = require("express");
const _ = express.Router();
const categoryController = require("../../controller/category.controller");
const { upload } = require("../../middleware/multer.middle");
_.route("/create-category").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  categoryController.createCategory
);
_.route("/all-category").get(categoryController.getAllCategory);
_.route("/single-category/:slug").get(categoryController.singleCategory);
_.route("/update-category/:slug").put(
  upload.fields([{ name: "image", maxCount: 1 }]),
  categoryController.updateCategory
);

module.exports = _;
