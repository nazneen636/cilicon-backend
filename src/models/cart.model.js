const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: mongoose.Types.ObjectId,
      ref: "Variant",
      required: false, // optional if product has no variants
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      //   required: true, // price per unit at time of adding to cart
    },
    totalItemPrice: {
      type: Number,
      //   required: true, // quantity * price
    },
    size: {
      type: String,
      default: "N/A",
    },
    color: {
      type: String,
      default: "N/A",
    },
  }
  //   { _id: false }
);

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
    guestId: {
      type: String,
      trim: true,
      required: false,
    },
    items: [cartItemSchema],
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    afterApplyCouponPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model.Cart || mongoose.model("Cart", cartSchema);
