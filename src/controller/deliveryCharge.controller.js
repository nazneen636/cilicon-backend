const {
  uploadCloudinaryFile,
  deleteCloudinary,
} = require("../helpers/cloudinary");
const { customError } = require("../helpers/customError");
const DeliveryChargeModel = require("../models/delivaryCharge.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

exports.createDeliveryCharge = asyncHandler(async (req, res) => {
  const { name, deliveryCharge, description } = req.body;
  if (!name || !deliveryCharge) {
    throw new customError(401, "Name and delivery charge required");
  }

  // save db
  const deliveryChargeInstance = await new DeliveryChargeModel({
    name,
    deliveryCharge,
    description,
  });
  await deliveryChargeInstance.save();
  if (!deliveryChargeInstance) {
    throw new customError(401, "create delivery charge failed");
  }
  apiResponse.sendSuccess(
    res,
    "create delivery charge successfully",
    201,
    deliveryChargeInstance
  );
});

exports.getAllDeliveryCharge = asyncHandler(async (req, res) => {
  const delivaryCharge = await DeliveryChargeModel.find().sort({
    createdAt: -1,
  });
  if (!delivaryCharge) {
    throw new customError(401, "get all delivery charge failed");
  }
  apiResponse.sendSuccess(
    res,
    "all delivery charge get  successfully",
    201,
    delivaryCharge
  );
});

exports.singleDeliveryCharge = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const delivaryCharge = await DeliveryChargeModel.findOne({ _id });
  if (!delivaryCharge) {
    throw new customError(401, "delivery charge not found");
  }
  apiResponse.sendSuccess(
    res,
    "delivery charge get  successfully",
    201,
    delivaryCharge
  );
});

exports.updateDeliveryCharge = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { name, deliveryCharge, description } = req.body;
  const updatedDeliveryCharge = await DeliveryChargeModel.findByIdAndUpdate(
    _id,
    {
      ...req.body,
    },
    { new: true }
  );
  if (!updatedDeliveryCharge) {
    throw new customError(401, "update failed");
  }

  apiResponse.sendSuccess(
    res,
    "delivery charge updated  successfully",
    201,
    updatedDeliveryCharge
  );
});

exports.deleteDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleteDeliveryCharge = await DeliveryChargeModel.findOneAndDelete({
    _id: id,
  });
  if (!deleteDeliveryCharge) {
    throw new customError(401, "delete failed");
  }
  apiResponse.sendSuccess(
    res,
    "delivery charge deleted  successfully",
    201,
    deleteDeliveryCharge
  );
});
