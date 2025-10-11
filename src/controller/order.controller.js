const { customError } = require("../helpers/customError");
const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/variant.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateOrder } = require("../validation/order.validation");
const NodeCache = require("node-cache");
const delivaryChargeModel = require("../models/delivaryCharge.model");
const invoiceModel = require("../models/invoice.model");
const myCache = new NodeCache();

// apply deliverycharge method
const applyDeliveryCharge = async (dcId) => {
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

  // reduce stock
  let allStockAdjustPromise = [];
  for (let item of cart.items) {
    // if product
    if (item.product) {
      allStockAdjustPromise.push(
        productModel.findOneAndUpdate(
          { _id: item.product._id },
          { $inc: { totalStock: -item.quantity }, totalSales: item.quantity },
          {
            new: true,
          }
        )
      );
    }
    // if variant
    if (item.variant) {
      allStockAdjustPromise.push(
        variantModel.findOneAndUpdate(
          { _id: item.variant._id },
          {
            $inc: { stockVariant: -item.quantity },
            totalSales: item.quantity,
          },
          {
            new: true,
          }
        )
      );
    }
  }

  let order = null;
  try {
    order = new orderModel({
      user: user,
      guestId: guestId,
      items: cart.items,
      shippingInfo,
      deliveryCharge,
      paymentMethod,
      followUp: req.user || "",
      totalQuantity = cart.totalQuantity;
    });
    // merge delivery charge
    const { name, deliveryCharge } = await applyDeliveryCharge(deliveryCharge);
    order.discountAmount = cart.discountAmount;
    order.discountType = cart.discountType;
    order.finalAmount = cart.finalAmount + deliveryCharge;
    order.shippingInfo.deliveryZone = name;

    // payment
    const transactionID = `INV-${crypto
      .randomUUID()
      .split("-")[0]
      .toLocaleUpperCase()}`;
    // make invoice database
    const invoice = await invoiceModel({
      inVoiceId: transactionID,
      order: order._id,
      customerDetails: shippingInfo,
      finalAmount: order.finalAmount,
      discountAmount: order.discountAmount,
      deliveryChargeAmount: deliveryCharge,
    });

    if (paymentMethod == "cod") {
      order.paymentMethod = "cod";
      order.paymentStatus = "pending";
      order.transactionID = transactionID;
      order.orderStatus = "pending";
      order.invoice = invoice.inVoiceId;

    } else {
    }
  } catch (error) {
    throw new customError(500, "order failed", error);
  }
});

// if (!cart) {
//   throw new customError(500, "brand create failed");
// }
// apiResponse.sendSuccess(res, "brand created successfully", 200, cart);
// await brand.save();
