const {
  uploadCloudinaryFile,
  deleteCloudinary,
} = require("../helpers/cloudinary");
const { customError } = require("../helpers/customError");
const { generatedQRCode, generatedBarCode } = require("../helpers/qrCode");
const variantModel = require("../models/variant.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateVariant } = require("../validation/variant.validation");
const productModel = require("../models/product.model");

exports.createVariant = asyncHandler(async (req, res) => {
  const data = await validateVariant(req);

  let imageUrl = await Promise.all(
    data.images.map((img) => uploadCloudinaryFile(img.path))
  );
  console.log(data.images);
  // save
  const variant = await variantModel.create({ ...data, image: imageUrl });
  if (!variant) {
    throw new customError(500, "variant not created");
  }

  // variant id created
  const checkUpdateProduct = await productModel.findOneAndUpdate(
    { _id: data.product },
    { $push: { variants: variant._id } },
    { new: true }
  );
  if (!checkUpdateProduct) {
    throw new customError(500, "variant not push");
  }
  apiResponse.sendSuccess(res, "variation created successfully", 201, variant);
});

exports.getAllVariant = asyncHandler(async (_, res) => {
  const variant = await variantModel
    .find()
    .populate("product")
    .sort({ createdAt: -1 });
  if (!variant || variant.length === 0) {
    throw new customError(500, "no variant found");
  }
  apiResponse.sendSuccess(res, "variation fetched successfully", 201, variant);
});
exports.updateVariant = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const variant = await variantModel.findOne({ slug });

  if (!variant) {
    throw new customError(500, "variant not found");
  }
  apiResponse.sendSuccess(res, "variation fetched successfully", 201, variant);
});
