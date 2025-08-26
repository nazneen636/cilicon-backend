const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");
const { customError } = require("../helpers/customError");
const { ref } = require("joi");

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      //   ref:disc
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// make a slugify
subCategorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      remove: undefined,
      lower: false,
      strict: false,
      locale: "vi",
      trim: true,
    });
  }
  next();
});

// check is slug  already exists or not
subCategorySchema.pre("save", async function (next) {
  const isExists = await this.constructor.findOne({ slug: this.slug });
  if (isExists && !isExists._id.equals(this._id)) {
    throw new customError(401, `${this.name} Already exists try new one`);
  }
  next();
});

// auto populate and sort
function autoPopulate(next) {
  this.populate({ path: "category" });
  next();
}

function autoSort(next) {
  this.sort({ createdAt: -1 });
  next();
}

subCategorySchema.pre("find", autoPopulate, autoSort);
// auto populate and sort
module.exports =
  mongoose.model("SubCategory", subCategorySchema) ||
  mongoose.model.SubCategory;
