const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");
const { customError } = require("../helpers/customError");

const discountSchema = new Schema(
  {
    discountValidFrom: {
      type: Date,
      required: true,
    },
    discountValidTo: {
      type: Date,
      required: true,
    },
    discountName: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ["tk", "percentage"],
      required: true,
    },
    discountValueByAmount: {
      type: Number,
      default: 0,
    },
    discountValueByPercentage: {
      type: Number,
      max: 100,
      default: 0,
    },
    discountPlan: {
      type: String,
      enum: ["category", "subCategory", "product"],
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// slugify
discountSchema.pre("save", async function (next) {
  if (this.isModified("discountName")) {
    this.slug = slugify(this.discountName, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }
  next();
});

// check slug already exists
discountSchema.pre("save", async function (next) {
  const isExists = await this.constructor.findOne({ slug: this.slug });
  if (isExists && !isExists._id.equals(this._id)) {
    throw new customError(
      401,
      `${this.discountName} already exists, try another`
    );
  }
  next();
});

module.exports =
  mongoose.model("Discount", discountSchema) || mongoose.models.Discount;
