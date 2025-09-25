const {
  uploadCloudinaryFile,
  deleteCloudinary,
} = require("../helpers/cloudinary");
const { customError } = require("../helpers/customError");
const customerReviewModel = require("../models/product.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  validateCustomerReview,
} = require("../validation/customerReview.validation");

exports.createReview = asyncHandler(async (req, res) => {
  const data = await validateCustomerReview(req);
  const imageUrl = await Promise.all(
    data.image?.map((img) => uploadCloudinaryFile(img.path))
  );

  const submitReview = await customerReviewModel.findByIdAndUpdate(
    {
      _id: data.productId,
    },
    { $push: { review: { ...data, image: imageUrl } } },
    { new: true }
  );
  if (!submitReview) {
    throw new customError(401, "error in submitting review");
  }
  apiResponse.sendSuccess(res, "review create successfully", 201, submitReview);
});
