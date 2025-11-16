const express = require("express");
const _ = express.Router();
const categoryController = require("../../controller/category.controller");
const { upload } = require("../../middleware/multer.middle");
const { authgurd } = require("../../middleware/auth.middleware");
const { autorize } = require("../../middleware/authorize.middleware");
_.route("/create-category").post(
  authgurd,
  autorize("category"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  categoryController.createCategory
);
_.route("/all-category").get(categoryController.getAllCategory);
_.route("/single-category/:slug").get(categoryController.singleCategory);
_.route("/update-category/:slug").put(
  upload.fields([{ name: "image", maxCount: 1 }]),
  categoryController.updateCategory
);
_.route("/delete-category/:slug").delete(categoryController.deleteCategory);
_.route("/active-category/").get(categoryController.activeCategory);
module.exports = _;
