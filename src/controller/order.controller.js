const { customError } = require("../helpers/customError");
const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateOrder } = require("../validation/order.validation");
const NodeCache = require("node-cache");
const delivaryChargeModel = require("../models/delivaryCharge.model");
const myCache = new NodeCache();

// apply deliverycharge method
const applyDeliveryCharge = async (grossTotalAmount, dcId) => {
  try {
    const deliveryCharge = await delivaryChargeModel.findOne({ _id: dcId });
    if (!deliveryCharge)
      throw new customError(401, "not found delivery charge issues" + error);
    return deliveryCharge;
  } catch (error) {
    throw new customError(401, "apply delivery charge issues" + error);
  }
};
exports.createOrder = asyncHandler(async (req, res) => {
  const { user, guestId, shippingInfo, deliveryCharge, paymentMethod } =
    await validateOrder(req);
  const query = user ? { user } : { guestId };
  const cart = await cartModel
    .findOne(query)
    .populate("items.variant")
    .populate("items.product")
    .populate("coupon");
  console.log(cart);

  // if (!cart) {
  //   throw new customError(500, "brand create failed");
  // }
  // apiResponse.sendSuccess(res, "brand created successfully", 200, cart);
  // await brand.save();
});
