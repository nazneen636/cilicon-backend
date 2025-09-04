const { customError } = require("../helpers/customError");
const discountModel = require("../models/discount.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateDiscount } = require("../validation/discount.validation");

exports.createDiscount = asyncHandler(async (req, res) => {
  const value = await validateDiscount(req);
  console.log(value);

  //   const discount = await discountModel.create({
  //     name: value.name,
  //     image: imageAsset,
  //   });

  //   if (!category) {
  //     throw new customError(500, "category create failed");
  //   }
  //   apiResponse.sendSuccess(res, "category created successfully", 200, category);
});
