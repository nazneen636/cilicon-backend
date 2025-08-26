const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");
const { customError } = require("../helpers/customError");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {},
    slug: {
      type: String,
    },
    subCategory: [],
    discount: [],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// make a slugify
categorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      locale: "vi",
      trim: true,
    });
  }
  next();
});

//check category slug already exists or not
categorySchema.pre("save", async function (next) {
  const isExists = await this.constructor.findOne({ slug: this.slug });
  if (isExists && !isExists._id.equals(this._id)) {
    throw new customError(401, `${this.name} Already exists try new one`);
  }
});

// check category already exists or not
categorySchema.pre("save", async function (next) {
  const isExists = await this.constructor.findOne({ slug: this.slug });
  if (isExists && isExists._id.toString() !== this.id.toString()) {
    throw new Error(401, `${this.name} category already exists, try another`);
  }
  next();
});

module.exports =
  mongoose.model("Category", categorySchema) || mongoose.models.Category;
