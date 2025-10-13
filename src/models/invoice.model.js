const { ref, required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    inVoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    customerDetails: {},

    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    deliveryChargeAmount: {
      type: Number,
      required: true,
    },
    // invoiceUrl: {
    //   type: String,
    // },
    // paymentGatewayUrl: {
    //   type: String,
    // },
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
