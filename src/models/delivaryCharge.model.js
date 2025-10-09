const { required } = require("joi");
const mongoose = require("mongoose");
const { customError } = require("../helpers/customError");
const { Schema } = mongoose;

const deliveryChargeSchema = new Schema({
  name: {
    type: String,
    required: [true, "required delivery type name"],
    trim: true,
  },
  deliveryCharge: {
    type: Number,
    required: [true, "required delivery charge"],
  },
  description: {
    type: String,
    required: false,
  },
});

deliveryChargeSchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({ name: this.name });
  if (isExist && isExist._id.toString()) {
    throw new customError(401, "Delivery type with this name already exists");
  }
  next();
});
module.exports =
  mongoose.models.DeliveryCharge ||
  mongoose.model("DeliveryCharge", deliveryChargeSchema);
