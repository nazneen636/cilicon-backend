const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 👤 User or Guest (at least one required)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestId: {
      type: String,
      trim: true,
      default: null,
    },

    // 🛒 Items
    items: [
      {
        // product: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "Product",
        //   required: true,
        // },
        // price: {
        //   type: Number,
        //   required: true,
        //   min: 0,
        // },
        // quantity: {
        //   type: Number,
        //   required: true,
        //   min: 1,
        // },
        // totalPrice: {
        //   type: Number,
        //   required: true,
        //   min: 0,
        // },
      },
    ],

    // 🚚 Shipping info
    shippingInfo: {
      fullName: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: {
        type: String,
        trim: true,
        match: [/^\+?\d{10,15}$/, "Invalid phone number format"],
      },
      address: { type: String, trim: true, required: false },
      country: { type: String, trim: true, default: "Bangladesh" },
      deliveryZone: String,
    },

    // 🌍 Delivery info
    deliveryCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryCharge",
      required: true,
    },
    country: {
      type: String,
      trim: true,
      default: "Bangladesh",
    },
    deliveryZone: {
      type: String,
      enum: ["inside_dhaka", "outside_dhaka", "international"],
      default: "inside_dhaka",
    },

    // 💳 Payment details
    paymentMethod: {
      type: String,
      enum: ["cod", "sslCommerZ"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    paymentInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // 💰 Amounts
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountType: {
      type: String,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🧾 Coupon (optional)
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    // ⚙️ Metadata
    transactionId: { type: String, trim: true, default: null },
    valId: { type: String, trim: true, default: null },
    currency: { type: String, trim: true, default: "BDT" },
    paymentGatewayData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    orderStatus: {
      type: String,
      enum: ["pending", "hold", "confirmed", "packaging"],
      default: "pending",
    },
    invoiceId: { type: String, trim: true, default: null },
    courier: {
      name: {
        type: String,
        default: null,
      },
      trackingId: { type: String, default: null },
      rawResponse: { type: mongoose.Schema.Types.Mixed, default: null },
      status: {
        type: String,
        default: "pending",
      },
    },
    followUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    orderType: {
      type: String,
      enum: ["Complete", "Partial", "Preorder"],
      default: "Complete",
    },
    totalQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// ✅ Custom validation: ensure either user or guestId is provided
orderSchema.pre("validate", function (next) {
  if (!this.user && !this.guestId) {
    next(new Error("Either user or guestId is required"));
  } else {
    next();
  }
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
