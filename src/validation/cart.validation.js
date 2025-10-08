const Joi = require("joi");
const { customError } = require("../helpers/customError");

// Regex for MongoDB ObjectId
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// const cartItemSchema = Joi.object({
//   productId: Joi.string()
//     .allow(null, "")
//     .regex(objectIdPattern)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid productId (must be ObjectId)",
//       "any.required": "productId is required",
//     }),
//   variantId: Joi.string()
//     .allow(null, "")
//     .regex(objectIdPattern)
//     .optional()
//     .allow(null, "")
//     .messages({
//       "string.pattern.base": "Invalid variantId (must be ObjectId)",
//     }),
//   quantity: Joi.number().integer().min(1).required().messages({
//     "number.base": "Quantity must be a number",
//     "number.min": "Quantity must be at least 1",
//     "any.required": "Quantity is required",
//   }),
//   price: Joi.number().min(0).messages({
//     "number.base": "Price must be a number",
//     // "any.required": "Price is required",
//   }),
//   totalItemPrice: Joi.number().min(0).messages({
//     "number.base": "totalItemPrice must be a number",
//     // "any.required": "totalItemPrice is required",
//   }),
//   size: Joi.string().optional().default("N/A").messages({
//     "string.base": "size must be a string",
//   }),
//   color: Joi.string().optional().default("N/A").messages({
//     "string.base": "color must be a string",
//   }),
// });

const cartValidationSchema = Joi.object(
  {
    user: Joi.string()
      .allow(null, "")
      .regex(objectIdPattern)
      .optional()
      .messages({
        "string.pattern.base": "Invalid userId (must be ObjectId)",
      }),
    guestId: Joi.string().allow(null, "").trim().optional(),
    product: Joi.string()
      .optional()
      .allow(null, "")
      .regex(objectIdPattern)
      .trim()
      .messages({
        "string.base": "Product ID must be string",
        "string.pattern.base": "Product ID must be a valid Object ID",
      }),
    variant: Joi.string()
      .regex(objectIdPattern)
      .optional()
      .allow(null, "")
      .messages({
        "string.pattern.base": "Variant ID must be a valid Object ID",
      }),
    quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Quantity ID must be a number",
      " number.min": "Quantity must be at least 1",
      "any.required": "Quantity ID is required",
    }),
    coupon: Joi.string().allow(null, "").optional().trim(),
    color: Joi.string().allow(null, "").optional().trim(),
    size: Joi.string().allow(null, "").optional().trim(),
    // totalPrice: Joi.number().min(0).messages({
    //   "number.base": "totalPrice must be a number",
    // }),
    // discountPrice: Joi.number().min(0).optional().default(0).messages({
    //   "number.base": "discountPrice must be a number",
    // }),
    // afterApplyCouponPrice: Joi.number().min(0).optional().default(0).messages({
    //   "number.base": "afterApplyCouponPrice must be a number",
    // }),
  },
  { abortEarly: true }
).unknown(true);

// ✅ Middleware-style validator
const validateCart = async (req) => {
  try {
    const value = await cartValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    if (error.details) {
      throw new customError(401, error.message || error);
    } else {
      throw new customError(
        400,
        "Cart validation error: " +
          error.details.map((err) => err.message).join(", ")
      );
    }
  }
};

module.exports = { validateCart };
