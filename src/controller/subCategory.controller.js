const { customError } = require("../helpers/customError");
const subcategoryModel = require("../models/subcategory.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateSubCategory } = require("../validation/subCategory.validation");

exports.createSubCategory = asyncHandler(async (req, res) => {
  const value = await validateSubCategory(req);

  //   save subcategory
  const subCategory = await subcategoryModel.create(value);
  if (!subCategory) {
    throw new customError(401, "failed create subcategory");
  }
  apiResponse.sendSuccess(
    res,
    "subcategory created successfully",
    200,
    subCategory
  );
});

exports.allSubCategory = asyncHandler(async (req, res) => {
  const allSubCategory = await subcategoryModel
    .find()
    .sort({ createdAt: -1 })
    .populate({ path: "category" });
  if (!allSubCategory) {
    throw new customError(401, "failed get all subcategory");
  }
  apiResponse.sendSuccess(
    res,
    "get all subcategory successfully",
    200,
    allSubCategory
  );
});

// single====
exports.singleSubCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(400, `${this.slug} not found`);
  }
  const singleSubCategory = await subcategoryModel
    .findOne({ slug })
    .select("-_id -updatedAt -createdAt -isActive -__v");

  if (!singleSubCategory) {
    throw new customError(400, `category not found`);
  }
  apiResponse.sendSuccess(
    res,
    "category found successfully",
    200,
    singleSubCategory
  );
});

// update=====
exports.updateSubCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(400, `${this.slug} not found`);
  }
  const updateSubCat = await subcategoryModel.findOneAndUpdate(
    { slug },
    { ...req.body },
    { new: true }
  );
  if (!updateSubCat) {
    throw new customError(400, `sub category not found`);
  }

  //   if (req.body.name) {
  //     updateSubCat.name = req.body.name;
  //   }

  await updateSubCat.save();

  apiResponse.sendSuccess(
    res,
    "category updated successfully",
    200,
    updateSubCat
  );
});
