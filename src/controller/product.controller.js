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
  if (!slug) {
    throw new customError(500, "product slug not found");
  }
  const product = await productModel
    .findOne({ slug })
    .populate({ path: "category" })
    .populate({ path: "subCategory" })
    .populate({ path: "brand" });
  // .populate({ path: "reviews" });

  if (!product) {
    throw new customError(500, "product not found");
  }
  apiResponse.sendSuccess(res, "product get successfully", 200, product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(500, "product slug not found");
  }
  const product = await productModel.findOneAndUpdate({ slug }, req.body, {
    new: true,
  });

  // .populate({ path: "reviews" });

  if (!product) {
    throw new customError(500, "product not found");
  }
  apiResponse.sendSuccess(res, "product update successfully", 200, product);
});

exports.updateProductImage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(500, "product slug not found");
  }
  const product = await productModel.findOne({ slug });
  if (!product) {
    throw new customError(500, "product not found");
  }
  // console.log(req.body.image);

  for (const imageid of req.body.imageid) {
    await deleteCloudinary(imageid);
    product.image = product.image.filter((img) => img.publicId !== imageid);
  }
  for (const image of req.files.image) {
    const imageInfo = await uploadCloudinaryFile(image.path);
    product.image.push(imageInfo);
  }
  await product.save();
  apiResponse.sendSuccess(
    res,
    "product image update successfully",
    200,
    product
  );
});

exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const { category, subCategory, brand, name } = req.query;
  let query;

  if (category) {
    query = { ...query, category: category };
  }
  if (subCategory) {
    query = { ...query, subCategory: subCategory };
  }
  if (brand) {
    query = { ...query, brand: brand };
  }

  const product = await productModel.find({ query });
  if (!product) {
    throw new customError(404, "No product found");
  }
  apiResponse.sendSuccess(
    res,
    "search product fetched successfully",
    200,
    product
  );
  console.log(query);
});

exports.priceFilterProducts = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  if (!minPrice || !maxPrice) {
    throw new customError(400, "Min and Max price are required");
  }

  const product = await productModel.find({
    $and: [{ retailPrice: { $gte: minPrice, $lte: maxPrice } }],
  });
  if (!product) throw new customError(404, "No products found");
  apiResponse.sendSuccess(res, "products fetched successfully", 200, product);
});
