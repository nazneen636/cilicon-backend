const { customError } = require("../helpers/customError");
const discountModel = require("../models/discount.model");
const categoryModel = require("../models/category.model");
const subcategoryModel = require("../models/subcategory.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateDiscount } = require("../validation/discount.validation");

exports.createDiscount = asyncHandler(async (req, res) => {
  const validateData = await validateDiscount(req);
  const discount = await discountModel.create(validateData);

  if (!discount) {
    throw new customError(500, "discount create failed");
  }
  // update category discount
  if (validateData.discountPlan === "category" && validateData.category) {
    await categoryModel.findByIdAndUpdate(validateData.category, {
      discount: discount._id,
    });
  }

  // update subcategory discount
  if (validateData.discountPlan === "subCategory" && validateData.subCategory) {
    await subcategoryModel.findByIdAndUpdate(validateData.subCategory, {
      discount: discount._id,
    });
  }
  apiResponse.sendSuccess(res, "discount created successfully", 200, discount);
});

exports.getAllDiscount = asyncHandler(async (req, res) => {
  const discount = await discountModel.find().sort({ createAt: -1 });

  if (!discount) {
    throw new customError(500, "discount fetching failed");
  }
  apiResponse.sendSuccess(res, "all discount get successfully", 200, discount);
});

exports.singleDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const discount = await discountModel
    .findOne({ slug: slug })
    .populate(["category", "subCategory"]);

  if (!discount) {
    throw new customError(500, "single discount fetching failed");
  }
  apiResponse.sendSuccess(
    res,
    "single discount get successfully",
    200,
    discount
  );
});
exports.updateDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const validateData = await validateDiscount(req);
  const discount = await discountModel.findOne({ slug: slug });
  // discount.discountName = req.body.discountName;
  if (!discount) {
    throw new customError(500, "discount fetching failed");
  }
  if (discount.discountPlan === "category" && discount.category) {
    await categoryModel.findByIdAndUpdate(discount.category, {
      discount: null,
    });
  }
  if (discount.discountPlan === "subCategory" && discount.subCategory) {
    await subcategoryModel.findByIdAndUpdate(discount.subCategory, {
      discount: null,
    });
  }

  // update
  if (validateData.discountPlan === "subCategory" && validateData.subCategory) {
    await subcategoryModel.findByIdAndUpdate(validateData.subCategory, {
      discount: discount._id,
    });
  }

  if (validateData.discountPlan === "category" && validateData.category) {
    await categoryModel.findByIdAndUpdate(validateData.category, {
      discount: discount._id,
    });
  }
  // Object.assign(discount, validateData);
  // await discount.save();
  const updateDiscount = await discountModel.findOneAndUpdate(
    { slug: slug },
    validateData,
    { new: true }
  );
  apiResponse.sendSuccess(res, "update discount successfully", 200, discount);
});
