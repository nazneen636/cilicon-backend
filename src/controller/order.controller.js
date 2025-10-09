const { customError } = require("../helpers/customError");
const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateOrder } = require("./order.controller");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

exports.createOrder = asyncHandler(async (req, res) => {
  const { user, guestId, shippingInfo, deliveryCharge, paymentMethod } =
    await validateOrder(req);
  const query = user ? { user } : { guestId };
  const cart = await cartModel.findOne(query);
  console.log(cart);

  // if (!cart) {
  //   throw new customError(500, "brand create failed");
  // }
  // apiResponse.sendSuccess(res, "brand created successfully", 200, cart);
  // await brand.save();
});
