const { required, boolean } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
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
  { Timestamp: true }
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

// check user email and phone already exists or not
categorySchema.pre("save", async function (next) {
  const isExists = await this.constructor.findOne({ slug: this.slug });
  if (isExists && isExists._id.toString() !== this.id.toString()) {
    throw new Error(401, `${this.name} category already exists, try another`);
  }
  next();
});

module.exports =
  mongoose.model("Category", categorySchema) || mongoose.models.Category;
