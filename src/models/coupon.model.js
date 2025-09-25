const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");
const { customError } = require("../helpers/customError");

const couponSchema = new Schema(
  {
    // slug: {
    //   type: String,
    //   unique: true,
    //   trim: true,
    // },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from code
// couponSchema.pre("save", function (next) {
//   if (this.isModified("code")) {
//     this.slug = slugify(this.code, { lower: true });
//   }
//   next();
// });

couponSchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({ code: this.code });
  if (isExist && !isExist._id.equals(this._id)) {
    throw new customError(401, "Coupon code already exists");
  }
  next();
});

module.exports =
  mongoose.model.Coupon || mongoose.model("Coupon", couponSchema);
