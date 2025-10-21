const { customError } = require("../helpers/customError");
const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const couponModel = require("../models/coupon.model");
const variantModel = require("../models/variant.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateOrder } = require("../validation/order.validation");
const delivaryChargeModel = require("../models/delivaryCharge.model");
const invoiceModel = require("../models/invoice.model");
const crypto = require("crypto");
const SSLCommerzPayment = require("sslcommerz-lts");
const { mailer } = require("../helpers/nodemailer");
const {
  OrderConfirmation,
  orderConfirmationSms,
} = require("../template/registration.template");
const { sendSms } = require("../helpers/sendSms");

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_API_KEY;
const is_live = process.env.NODE_ENV == "development" ? false : true;

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

  // reduce stock
  let allStockAdjustPromise = [];
  for (let item of cart.items) {
    // if product
    if (item.product) {
      allStockAdjustPromise.push(
        productModel.findOneAndUpdate(
          { _id: item.product._id },
          { $inc: { totalStock: item.quantity }, totalSales: -item.quantity },
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
            $inc: { stockVariant: item.quantity },
            totalSales: -item.quantity,
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
      // items: cart.items,
      shippingInfo,
      deliveryCharge,
      paymentMethod,
      followUp: req.user || null,
      totalQuantity: cart.totalQuantity,
    });
    order.items = cart.items.map((item) => {
      if (item.product) {
        return {
          name: item.product.name,
          image: item.product.image,
          retailPrice: item.product.retailPrice,
          totalSales: item.product.totalSales,
        };
      }
      if (item.variant) {
        return {
          name: item.variant.name,
          image: item.variant.image,
          retailPrice: item.variant.retailPrice,
          totalSales: item.variant.totalSales,
        };
      }
    });
    // merge delivery charge
    const { name, deliveryCharge: deliveryChargeAmount } =
      await applyDeliveryCharge(deliveryCharge);
    // console.log(name, deliveryChargeAmount, "order");
    order.discountAmount = cart.discountAmount;
    order.discountType = cart.discountType;
    order.finalAmount = cart.finalAmount + deliveryChargeAmount;
    order.shippingInfo.deliveryZone = name;

    // payment
    const transactionID = `INV-${crypto
      .randomUUID()
      .split("-")[0]
      .toLocaleUpperCase()}`;

    // make invoice database
    const invoice = await invoiceModel.create({
      inVoiceId: transactionID,
      order: order._id,
      customerDetails: shippingInfo,
      finalAmount: order.finalAmount,
      discountAmount: order.discountAmount,
      deliveryChargeAmount: deliveryChargeAmount,
    });
    order.transactionId = transactionID;
    if (paymentMethod == "cod") {
      order.paymentMethod = "cod";
      order.paymentStatus = "pending";
      order.transactionID = transactionID;
      order.orderStatus = "pending";
      order.invoice = invoice.inVoiceId;
    } else {
      const data = {
        total_amount: order.finalAmount,
        currency: "BDT",
        tran_id: transactionID, // use unique tran_id for each api call
        success_url: `${process.env.BACKEND_URL}${process.env.BASE_API}/payment/success`,
        fail_url: `${process.env.BACKEND_URL}${process.env.BASE_API}/payment/fail`,
        cancel_url: `${process.env.BACKEND_URL}${process.env.BASE_API}/payment/cancel`,
        ipn_url: `${process.env.BACKEND_URL}${process.env.BASE_API}/payment/ipn`,
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: shippingInfo.fullName,
        cus_email: shippingInfo.email || "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        // cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: shippingInfo.phone || "01711111111",

        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const response = await sslcz.init(data);
      // save in order model
      await order.save();

      if (shippingInfo.email) {
        const template = OrderConfirmation(
          cart,
          shippingInfo,
          order.finalAmount
        );
        sendEmail(template, shippingInfo.email, "Order Confirmation");
      }
      if (shippingInfo.phone) {
        const msgTemplate = orderConfirmationSms(
          order.inVoiceId || "id missing",
          shippingInfo.fullName,
          order.finalAmount
        );
        sendMsg(shippingInfo.phone, msgTemplate);
      }
      return apiResponse.sendSuccess(res, "payment initiate successful", 200, {
        url: response.GatewayPageURL,
      });
    }
    // save in order model
    await order.save();
    apiResponse.sendSuccess(res, "order successful", 200, order);
  } catch (error) {
    console.log("order failed", error);

    let allStockAdjustPromise = [];
    if (order && order._id) {
      for (let item of cart.items) {
        // if product
        if (item.product) {
          allStockAdjustPromise.push(
            productModel.findOneAndUpdate(
              { _id: item.product._id },
              {
                $inc: { totalStock: item.quantity },
                totalSales: -item.quantity,
              },
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
                $inc: { stockVariant: item.quantity },
                totalSales: -item.quantity,
              }
            )
          );
        }
      }
    }

    // coupon rollback
    allStockAdjustPromise.push(
      couponModel.findOneAndUpdate(
        { _id: cart.coupon._id },
        // { $inc: { usedCount: -1 } }
        { usedCount: cart.coupon.usedCount - 1 }
      )
    );
  }
  await Promise.all(allStockAdjustPromise);
});

// send email
const sendEmail = async (template, email, subject) => {
  await mailer(template, email, subject);
};

// send msg
const sendMsg = async (number, message) => {
  await sendSms(number, message);
};

exports.getAllOrder = asyncHandler(async (req, res) => {
  const allOrder = await orderModel.find().sort({ createdAt: -1 }).limit(30);
  if (!allOrder.length) {
    throw new customError(401, "order not found");
  }
  apiResponse.sendSuccess(res, "order retrieved successfully", 200, allOrder);
});

// update Order Status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, shippingInfo } = req.body;
  const allowUpdates = ["packaging", "hold", "confirmed"];
  const updated = await orderModel.findOneAndUpdate(
    { _id: id },
    {
      orderStatus: allowUpdates.includes(status) && status,
      shippingInfo: { ...shippingInfo },
    },
    { new: true }
  );
  if (!updated) {
    throw new customError(404, "order not updated");
  }
  apiResponse.sendSuccess(res, "order updated successfully", 201, updated);
});

// get all order status
exports.getTotalOrderStatusUpdate = asyncHandler(async (req, res) => {
  const getStatus = await orderModel.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        totalAmount: { $sum: "$finalAmount" },
      },
    },
  ]);
  apiResponse.sendSuccess(res, "get status successfully", 200, getStatus);
});
