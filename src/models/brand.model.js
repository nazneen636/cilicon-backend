const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");
const { customError } = require("../helpers/customError");

const brandSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    image: {},
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Generate slug before saving
brandSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      locale: "en",
      trim: true,
    });
  }
  next();
});

// Check if slug already exists
brandSchema.pre("save", async function (next) {
  const isExists = await this.constructor.findOne({ slug: this.slug });
  if (isExists && !isExists._id.equals(this._id)) {
    throw new customError(401, `${this.name} already exists, try another one`);
  }
  next();
});

// Check if name already exists (optional extra validation)
brandSchema.pre("save", async function (next) {
  const isExists = await this.constructor.findOne({ name: this.name });
  if (isExists && !isExists._id.equals(this._id)) {
    throw new customError(401, `Brand "${this.name}" already exists`);
  }
  next();
});

module.exports = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
