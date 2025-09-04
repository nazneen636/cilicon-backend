const {
  uploadCloudinaryFile,
  deleteCloudinary,
} = require("../helpers/cloudinary");
const { customError } = require("../helpers/customError");
const brandModel = require("../models/brand.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateBrand } = require("../validation/brand.validation");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

exports.createBrand = asyncHandler(async (req, res) => {
  const value = await validateBrand(req);
  //   upload image
  const imageAsset = await uploadCloudinaryFile(value?.image?.path);
  console.log(imageAsset.url);

  //   save data into db
  const brand = new brandModel({
    name: value.name,
    image: imageAsset,
  });

  if (!brand) {
    throw new customError(500, "brand create failed");
  }
  apiResponse.sendSuccess(res, "brand created successfully", 200, brand);
  await brand.save();
});

exports.getAllBrand = asyncHandler(async (req, res) => {
  const value = myCache.get("brands");

  if (value == undefined) {
    const brands = await brandModel.find().sort({ createdAt: -1 });
    myCache.set("brands", JSON.stringify(brands), 10000);

    if (!brands || brands.length === 0) {
      throw new customError(500, "no brand found");
    }
    return apiResponse.sendSuccess(
      res,
      "brand fetched successfully",
      200,
      brands
    );
  }

  return apiResponse.sendSuccess(
    res,
    "brand fetched successfully",
    200,
    JSON.parse(value)
  );
});

// single====
exports.singleBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(400, `${this.slug} not found`);
  }
  const brand = await brandModel.findOne({ slug }).select("-isActive -__v");
  console.log(brand);

  if (!brand) {
    throw new customError(400, `brand not found`);
  }
  apiResponse.sendSuccess(res, "brand found successfully", 200, brand);
});
