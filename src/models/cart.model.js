const { number } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    variant: {
      type: mongoose.Types.ObjectId,
      ref: "Variants",
      default: null,
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
    totalPrice: {
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
      // type: mongoose.Types.ObjectId,
      // ref: "Coupon",
      type: String,
      required: false,
    },
    grossTotalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      min: 0,
    },
    discountType: {
      type: String,
      default: "N/A",
    },
    discountAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model.Cart || mongoose.model("Cart", cartSchema);
