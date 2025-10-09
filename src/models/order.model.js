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
      default: null,
      trim: true,
    },

    // 🛒 Items (optional, but can validate later in controller)
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        quantity: Number,
        totalPrice: Number,
      },
    ],

    // 🚚 Shipping info (required)
    shippingInfo: {
      fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\+?\d{10,15}$/, "Invalid phone number format"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true,
      },
    },

    // 🌍 Delivery info (deliveryCharge required)
    deliveryCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryCharge",
      required: [true, "Delivery charge is required"],
    },

    country: {
      type: String,
      default: "Bangladesh",
      trim: true,
    },
    deliveryZone: {
      type: String,
      enum: ["inside_dhaka", "outside_dhaka", "international"],
      default: "inside_dhaka",
    },

    // 💳 Payment details (required)
    paymentMethod: {
      type: String,
      enum: ["cod", "sslCommerZ"],
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },

    // ⚙️ Optional metadata
    transactionId: String,
    valId: String,
    currency: {
      type: String,
      default: "BDT",
      trim: true,
    },
    paymentGatewayData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Hold", "Confirmed", "Packaging"],
      default: "Pending",
    },
    invoiceId: {
      type: String,
      trim: true,
      default: null,
    },
    followUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    orderType: {
      type: String,
      enum: ["Complete", "Partial", "preorder"],
      default: "Complete",
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ Custom validation: at least one of user or guestId
orderSchema.pre("validate", function (next) {
  if (!this.user && !this.guestId) {
    next(new Error("Either user or guestId is required"));
  } else {
    next();
  }
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
