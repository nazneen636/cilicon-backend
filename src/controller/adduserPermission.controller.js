const {
  uploadCloudinaryFile,
  deleteCloudinary,
} = require("../helpers/cloudinary");
const { customError } = require("../helpers/customError");
const userModel = require("../models/user.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateUser } = require("../validation/user.validation");

exports.addUser = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
  const images = req?.files?.image;
  if (images && images.length > 0) {
    throw new customError(401, "image not found");
  }
  const imageObj = await uploadCloudinaryFile(images[0].path);
  const userInstance = await userModel.create({ ...value, image: imageObj });
  console.log(userInstance);
  if (!userInstance) {
    throw new customError(401, "user not created");
  }
  apiResponse.sendSuccess(res, "user created successfully", 201, userInstance);
});
