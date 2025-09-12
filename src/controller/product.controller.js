const {
  uploadCloudinaryFile,
  deleteCloudinary,
} = require("../helpers/cloudinary");
const { customError } = require("../helpers/customError");
const { generatedQRCode, generatedBarCode } = require("../helpers/qrCode");
const productModel = require("../models/product.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateProduct } = require("../validation/product.validation");

exports.createProduct = asyncHandler(async (req, res) => {
  const data = await validateProduct(req);
  // save database
  const allImage = [];
  for (const image of data.images) {
    const imageInfo = await uploadCloudinaryFile(image?.path);
    allImage.push(imageInfo);
  }
  const product = await productModel.create({ ...data, image: allImage });
  if (!product) {
    throw new customError(500, "product create failed");
  }

  const link = `http://localhost:4000/api/v1${product.slug}`;
  const barCodeText = data?.qrCode
    ? data.qrCode
    : `${product.sku}-${product.name.slice(0, 3)}-${new Date().getFullYear()}`;
  const qrCode = await generatedQRCode(link);
  const barCode = await generatedBarCode(barCodeText);
  product.qrCode = qrCode;
  product.barCode = barCode;

  if (
    !data.retailPrice &&
    !data.purchasePrice &&
    !data.color &&
    !data.wholeSalePrice
  ) {
    product.variant = "multiple";
  } else {
    product.variant = "single";
  }
  await product.save();
  console.log(barCode);

  //   console.log(data);

  //   upload image

  console.log(allImage);

  apiResponse.sendSuccess(res, "product created successfully", 200, product);
  //   await brand.save();
});

exports.getAllProduct = asyncHandler(async (req, res) => {
  const product = await productModel.find({}).sort({ createdAt: -1 });
  if (!product) {
    throw new customError(500, "product not found");
  }
  apiResponse.sendSuccess(res, "product get successfully", 200, product);
});
exports.getSingleProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await productModel
    .findOne({ slug })
    .populate({ path: "category" })
    .populate({ path: "category" });

  if (!product) {
    throw new customError(500, "product not found");
  }
  apiResponse.sendSuccess(res, "product get successfully", 200, product);
});
