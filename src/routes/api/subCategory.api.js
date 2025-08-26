const express = require("express");
const _ = express.Router();
const SubCategoryController = require("../../controller/subCategory.controller");

_.route("/create-subcategory").post(SubCategoryController.createSubCategory);
_.route("/all-subcategory").get(SubCategoryController.allSubCategory);
_.route("/single-subcategory/:slug").get(
  SubCategoryController.singleSubCategory
);
_.route("/update-subcategory/:slug").put(
  SubCategoryController.updateSubCategory
);
module.exports = _;
