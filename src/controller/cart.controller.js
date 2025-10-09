const { customError } = require("../helpers/customError");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/variant.model");
const couponModel = require("../models/coupon.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateCart } = require("../validation/cart.validation");
const { default: mongoose } = require("mongoose");
const { getIo } = require("../socket/server");
// const io = getIo();
// apply coupon
const applyCoupon = async (totalPrice = 0, couponCode = null) => {
  if (!couponCode) return totalPrice;
  try {
    let afterDiscountPrice = 0;
    const coupon = await couponModel.findOne({ code: couponCode });
    if (!coupon) {
      throw new customError(401, "coupon not found");
    }
    // check expire
    if (Date.now() >= coupon.expireAt)
      throw new customError(401, "coupon date expired");
    if (coupon.usedCount >= coupon.usageLimit) {
      throw new customError(401, "coupon user limit expired");
    }
    if (coupon.discountType == "percentage") {
      let discountAmount = Math.ceil((totalPrice * coupon.discountValue) / 100);
      afterDiscountPrice = totalPrice - discountAmount;
      console.log(afterDiscountPrice);
    }
    if (coupon.discountType == "tk") {
      afterDiscountPrice = totalPrice - coupon.discountValue;
    }
    coupon.usedCount += 1;
    await coupon.save();
    return {
      afterApplyCouponPrice: afterDiscountPrice,
      discountType: coupon.discountType,
      discountAmount: coupon.discountValue,
      couponId: coupon._id,
    };
    console.log(afterApplyCouponPrice);
  } catch (error) {
    console.log("error apply coupon", error);
  }
};

exports.createCart = asyncHandler(async (req, res) => {
  const data = await validateCart(req);
  let product = null;
  let variant = null;
  let price = 0;

  if (data.product) {
    product = await productModel.findById(data.product);
    if (!product) {
      throw new customError(401, "product not found");
    }
    price = product.retailPrice;
  }
  if (data.variant) {
    variant = await variantModel.findById(data.variant);
    if (!variant) {
      throw new customError(401, "variant not found");
    }
    price = variant.retailPrice;
  }

  // find user or guest id
  let cartQuery = {};
  if (data.user) {
    cartQuery = { user: data.user };
  }
  if (!data.user) {
    cartQuery = { user: data.guestId };
  }
  let cart = await cartModel.findOne(cartQuery);
  if (!cart) {
    cart = new cartModel({
      user: data.user || null,
      guestId: data.guestId || null,
      items: [],
      coupon: data.coupon || null,
    });
  }

  // find product or variant
  let findIndex = -1;

  if (variant) {
    findIndex = cart.items.findIndex(
      (item) =>
        item.variant && item.variant.toString() == data.variant.toString()
    );
  } else {
    findIndex = cart.items.findIndex(
      (item) =>
        item.product && item.product.toString() == data.product.toString()
    );
  }
  // now update the item field
  if (findIndex > -1) {
    cart.items[findIndex].quantity += data.quantity;
    cart.items[findIndex].price += price;
    cart.items[findIndex].totalPrice = Math.round(
      cart.items[findIndex].quantity * price
    );
    if (data.color) {
      cart.items[findIndex].color = data.color;
    }
    if (data.size) {
      cart.items[findIndex].size = data.size;
    }
  } else {
    cart.items.push({
      product: data.product ? data.product : null,
      variant: data.variant ? data.variant : null,
      quantity: data.quantity ? data.quantity : null,
      price: price,
      totalPrice: Math.ceil(price * data.quantity),
      size: data.size,
      color: data.color,
    });
  }

  // calculate total price
  const totalCartItemPrice = cart.items.reduce(
    (acc, item) => {
      // let perItemPrice = item.price * item.quantity;
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );

  const { totalPrice, totalQuantity } = totalCartItemPrice;
  const afterApplyCoupon = await applyCoupon(totalPrice, data.coupon);

  // now update the cart model
  if (typeof afterApplyCoupon == "object") {
    cart.coupon = afterApplyCoupon.couponId || null;
    cart.grossTotalAmount = totalPrice;
    cart.totalQuantity = totalQuantity;
    cart.finalAmount = afterApplyCoupon.afterApplyCouponPrice;
    cart.discountType = afterApplyCoupon.discountType;
    cart.discountAmount = afterApplyCoupon.discountAmount;
  } else {
    cart.finalAmount = afterApplyCoupon.afterApplyCouponPrice;
    cart.totalQuantity = totalQuantity;
  }

  // await cartModel.updateMany(
  //   {},
  //   { $unset: { discountPrice: "", afterApplyCouponPrice: "" } }
  // );

  await cart.save();
  if (!data) {
    throw new customError(401, "cart create failed");
  }

  const io = getIo();
  io.to("123").emit("cart", {
    message: "add to cart successfully",
    data: cart,
  });

  apiResponse.sendSuccess(res, "add to cart successfully", 201, cart);
});

exports.decreaseQuantity = asyncHandler(async (req, res) => {
  const user = req.userId || req.body.user;
  const { guestId, cartItemId } = req.body;

  // find user or guest
  let query = user ? { user: user } : { guestId: guestId };
  const cart = await cartModel.findOne(query);

  // find the actual item
  const indexNumber = cart.items.findIndex(
    (item) => item._id.toString() == cartItemId.toString()
  );
  const targetCartItem = cart.items[indexNumber];
  if (targetCartItem.quantity > 1) {
    targetCartItem.quantity = targetCartItem.quantity - 1;
    targetCartItem.totalPrice = targetCartItem.quantity * targetCartItem.price;
  } else {
    throw new customError(401, "in cart at least you have one item");
  }

  const totalCartItemPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );
  const { totalPrice, totalQuantity } = totalCartItemPrice;
  cart.grossTotalAmount = totalPrice;
  cart.finalAmount = totalPrice;
  cart.totalQuantity = totalQuantity;
  await cart.save();

  const io = getIo();
  io.to("123").emit("cart", {
    message: "cart item decrease",
    data: cart,
  });

  apiResponse.sendSuccess(res, "decrease cart successfully", 201, cart);
});

exports.increaseQuantity = asyncHandler(async (req, res) => {
  const user = req.userId || req.body.user;
  const { guestId, cartItemId } = req.body;

  // find user or guest
  let query = user ? { user: user } : { guestId: guestId };
  const cart = await cartModel.findOne(query);

  // find the actual item
  const indexNumber = cart.items.findIndex(
    (item) => item._id.toString() == cartItemId.toString()
  );
  const targetCartItem = cart.items[indexNumber];
  if (targetCartItem.quantity > 0) {
    targetCartItem.quantity = targetCartItem.quantity + 1;
    targetCartItem.totalPrice = targetCartItem.quantity * targetCartItem.price;
  } else {
    throw new customError(401, "in cart at least you have one item");
  }

  const totalCartItemPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );
  const { totalPrice, totalQuantity } = totalCartItemPrice;
  cart.grossTotalAmount = totalPrice;
  cart.finalAmount = totalPrice;
  cart.totalQuantity = totalQuantity;
  await cart.save();

  const io = getIo();
  io.to("123").emit("cart", {
    message: "cart item increase",
    data: cart,
  });
  apiResponse.sendSuccess(res, "increase cart successfully", 201, cart);
});

exports.deleteCart = asyncHandler(async (req, res) => {
  const user = req.userId || req.body.user;
  const { guestId, cartItemId } = req.body;

  // find user or guest
  let query = user ? { user: user } : { guestId: guestId };
  const cart = await cartModel.findOneAndUpdate(
    query,
    {
      $pull: { items: { _id: new mongoose.Types.ObjectId(cartItemId) } },
    },
    { new: true }
  );

  const totalCartItemPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );
  const { totalPrice, totalQuantity } = totalCartItemPrice;
  cart.grossTotalAmount = totalPrice;
  cart.finalAmount = totalPrice;
  cart.totalQuantity = totalQuantity;
  await cart.save();

  // item exists
  if (cart.items.length == 0) {
    await cartModel.deleteOne({ _id: cart._id });
    // await cart.save();
    apiResponse.sendSuccess(res, "No items to delete", 201, null);
  }
  const io = getIo();
  io.to("123").emit("cart", {
    message: "cart item removed",
    data: cart,
  });
  apiResponse.sendSuccess(res, "cart remove successfully", 201, cart);
});
