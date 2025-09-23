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
  const { sort } = req.query;
  let sortQuery = {};

  if (sort === "newest") {
    sortQuery = { createdAt: -1 };
  }
  if (sort === "oldest") {
    sortQuery = { createdAt: 1 };
  }
  if (sort === "title-asc") {
    sortQuery = { name: 1 };
  }
  if (sort === "title-desc") {
    sortQuery = { name: -1 };
  }
  if (sort === "price-low") {
    sortQuery = { retailPrice: 1 }; // Low → High
  }
  if (sort === "price-high") {
    sortQuery = { retailPrice: -1 }; // High → Low
  }

  const products = await productModel
    .find({})
    .collation({ locale: "en", strength: 1 }) // case-insensitive title sort
    .sort(sortQuery);

  if (!products || products.length === 0) {
    throw new customError(404, "No product found");
  }

  apiResponse.sendSuccess(res, "Products fetched successfully", 200, products);
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

exports.getProducts = asyncHandler(async (req, res) => {
  const { category, subCategory, brand, tag, color, name } = req.query;
  let query = {};

  if (category) {
    query = { ...query, category: category };
  }
  if (subCategory) {
    query = { ...query, subCategory: subCategory };
  }
  if (brand) {
    if (Array.isArray(brand)) {
      query = { ...query, brand: { $in: brand } };
    } else {
      query = { ...query, brand: brand };
    }
  }

  if (tag) {
    if (Array.isArray(tag)) {
      query = { ...query, tag: { $in: tag } };
    } else {
      query = { ...query, tag: tag };
    }
  }

  if (color) {
    if (Array.isArray(color)) {
      query = { ...query, color: { $in: query } };
    } else {
      query = { ...query, color: color };
    }
  }

  const product = await productModel.find(query);
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

exports.productPagination = asyncHandler(async (req, res) => {
  const { page, item } = req.query;
  const skipAmount = (page - 1) * item;
  const totalItems = await productModel.countDocuments();
  const totalPage = Math.round(totalItems / item);
  console.log(totalPage);

  const product = await productModel
    .find()
    .limit(item)
    .skip(skipAmount)
    .populate({ path: "category" })
    .populate({ path: "subCategory" })
    .populate({ path: "brand" });
  if (!product) {
    throw new customError("product not found");
  }
  apiResponse.sendSuccess(res, "products fetched successfully", 200, {
    product,
    totalItems,
    totalPage,
  });
});
