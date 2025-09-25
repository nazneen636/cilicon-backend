const Joi = require("joi");
const { customError } = require("../helpers/customError");

const couponValidationSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(20).required().messages({
    "string.base": "Coupon code must be a string",
    "string.empty": "Coupon code cannot be empty",
    "string.min": "Coupon code must be at least 3 characters",
    "string.max": "Coupon code cannot exceed 20 characters",
    "any.required": "Coupon code is required",
  }),

  discountType: Joi.string().valid("percentage", "fixed").required().messages({
    "any.only": "Discount type must be either 'percentage' or 'fixed'",
    "any.required": "Discount type is required",
  }),

  discountValue: Joi.number().min(0).required().messages({
    "number.base": "Discount value must be a number",
    "number.min": "Discount value must be greater than or equal to 0",
    "any.required": "Discount value is required",
  }),

  expireAt: Joi.date().greater("now").required().messages({
    "date.base": "Expire date must be a valid date",
    "date.greater": "Expire date must be in the future",
    "any.required": "Expire date is required",
  }),

  usageLimit: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Usage limit must be a number",
    "number.min": "Usage limit must be at least 1",
  }),

  usedCount: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Used count must be a number",
    "number.min": "Used count cannot be negative",
  }),
});

const validateCoupon = async (req) => {
  try {
    const value = await couponValidationSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    return value;
  } catch (error) {
    throw new customError(
      401,
      "Coupon validation error: " +
        error.details.map((err) => err.message).join(", ")
    );
  }
};

module.exports = { validateCoupon };
