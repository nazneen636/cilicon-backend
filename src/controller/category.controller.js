const category = require("../models/category.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateCategory } = require("../validation/category.validation");

exports.createCategory = asyncHandler(async (req, res) => {
  const value = await validateCategory(req);
  console.log(value);
});
