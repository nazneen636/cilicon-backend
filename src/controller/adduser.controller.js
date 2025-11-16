const {
  uploadCloudinaryFile,
  deleteCloudinary,
} = require("../helpers/cloudinary");
const { customError } = require("../helpers/customError");
const userModel = require("../models/user.model");
require("../models/role.model");
require("../models/permission.modal");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateUser } = require("../validation/user.validation");

exports.addUser = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
  const images = req?.files?.image;
  if (images && images.length > 0) {
    const allowedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    images.forEach((img) => {
      if (!allowedFormats.includes(img.mimetype)) {
        throw new customError(401, "Image format not accepted, Try again");
      }
      if (img.size > 5 * 1024 * 1024) {
        throw new customError(401, "Image size must below 5mb");
      }
    });
  }
  const imageObj = await uploadCloudinaryFile(images[0].path);
  const userInstance = await userModel.create({ ...value, image: imageObj });
  console.log(userInstance);
  if (!userInstance) {
    throw new customError(401, "user not created");
  }
  apiResponse.sendSuccess(res, "user created successfully", 201, userInstance);
});

exports.getAllUser = asyncHandler(async (req, res) => {
  const users = await userModel
    .find({ role: { $exists: true, $ne: [] } })
    .sort({ createdAt: 1 })
    .populate("role");
  if (!users) {
    throw new customError(401, "No users found");
  }
  apiResponse.sendSuccess(res, "Users fetched successfully", 200, users);
});

exports.addPermissionToUser = asyncHandler(async (req, res) => {
  const { user, permission } = req.body;

  const userInstance = await userModel.findOneAndUpdate(
    { _id: user },
    { permission: permission },
    { new: true }
  );
  console.log(userInstance);
  if (!userInstance) {
    throw new customError(404, "User not found");
  }
  apiResponse.sendSuccess(res, "user created successfully", 200, userInstance);
});
