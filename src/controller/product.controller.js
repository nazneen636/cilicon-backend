const {
  uploadCloudinaryFile,
  deleteCloudinary,
} = require("../helpers/cloudinary");
const { customError } = require("../helpers/customError");
const productModel = require("../models/product.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateProduct } = require("../validation/product.validation");

exports.createProduct = asyncHandler(async (req, res) => {
  const data = await validateProduct(req);
  //   console.log(data);
  const allImage = [];
  //   upload image
  for (const image of data.images) {
    const imageInfo = await uploadCloudinaryFile(image?.path);
    allImage.push(imageInfo);
  }
  console.log(allImage);

  // create database
  const product = await productModel.create({ ...data, image: allImage });
  //   //   save data into db
  //   const brand = new brandModel({
  //     name: value.name,
  //     image: imageAsset,
  //   });

  if (!product) {
    throw new customError(500, "product create failed");
  }
  apiResponse.sendSuccess(res, "product created successfully", 200, product);
  //   await brand.save();
});
