const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");
const { customError } = require("../helpers/customError");

//  review schema
const reviewSchema = new Schema(
  {
    reviewerName: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: [{}],
    tag: [
      {
        type: String,
      },
    ],
    manufactureCountry: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
      max: 5,
    },
    warrantyInformation: {
      type: mongoose.Types.ObjectId,
      ref: "Warranty",
    },
    shippingInformation: {
      type: mongoose.Types.ObjectId,
      ref: "ShippingInfo",
    },
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
    review: [reviewSchema],
    sku: {
      type: String,
      unique: true,
      // required: true,
    },
    barCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    qrCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    groupUnit: {
      type: String,
      enum: ["Box", "Packet", "Dozen", "Custom"],
    },
    groupUnitQuantity: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      enum: ["Piece", "Kg", "litre", "Gram"],
    },
    size: [
      {
        type: String,
      },
    ],
    color: [
      {
        type: String,
      },
    ],
    totalStock: {
      type: Number,
      default: 0,
    },
    warehouseLocation: {
      type: mongoose.Types.ObjectId,
      ref: "WareHouse",
    },
    purchasePrice: {
      type: Number,
      // required: true,
    },
    retailPrice: {
      type: Number,
      // required: true,
    },
    retailProfitMarginByPercentage: {
      type: Number,
      max: 100,
    },
    wholeSalePrice: {
      type: Number,
    },
    wholeSaleProfitMarginByPercentage: {
      type: Number,
      max: 100,
    },
    minWholeSaleOrderQuantity: {
      type: Number,
      default: 1,
    },
    minOrder: {
      type: Number,
      default: 1,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    variant: {
      type: String,
      enum: ["multiple", "single"],
    },
    variants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ProductVariant",
      },
    ],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      // required: true,
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Cart",
      },
    ],
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Wishlist",
      },
    ],
    discount: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Discount",
      },
    ],
  },

  { timestamps: true }
);

// slugify product name -> slug
productSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }
  next();
});

// check slug already exists
productSchema.pre("save", async function (next) {
  const isExists = await this.constructor.findOne({ slug: this.slug });
  if (isExists && !isExists._id.equals(this._id)) {
    throw new customError(401, `${this.name} already exists, try another`);
  }
  next();
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
