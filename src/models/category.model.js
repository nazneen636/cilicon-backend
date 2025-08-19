const { required, boolean } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

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
      trim: true,
      require: true,
      unique: true,
      lowercase: true,
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

module.exports =
  mongoose.model("Category", categorySchema) || mongoose.models.Category;
