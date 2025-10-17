const Joi = require("joi");
const { customError } = require("../helpers/customError");

const orderValidationSchema = Joi.object(
  {
    user: Joi.string().optional().messages({
      "string.base": "User ID must be a string",
    }),

    guestId: Joi.string().optional().messages({
      "string.base": "Guest ID must be a string",
    }),

    shippingInfo: Joi.object({
      fullName: Joi.string().trim().min(3).max(50).required().messages({
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 3 characters",
        "string.max": "Full name must not exceed 50 characters",
        "any.required": "Full name is required",
      }),
      phone: Joi.string().pattern(/^[0-9]{10,15}$/),
      // .messages({
      //   "string.pattern.base":
      //     "Phone number must contain only digits (10–15)",
      //   "any.required": "Phone number is required",
      // }),
      email: Joi.string().trim(),
      // .messages({ "any.required": "email name is required" }),
      address: Joi.string().trim().min(5).required().messages({
        "string.empty": "Address is required",
        "string.min": "Address must be at least 5 characters long",
      }),
      city: Joi.string().trim().required().messages({
        "string.empty": "City is required",
      }),
    })
      .required()
      .messages({
        "object.base": "Shipping information must be an object",
        "any.required": "Shipping information is required",
      }),

    deliveryCharge: Joi.string().required().messages({
      "string.base": "Delivery charge must be a string id",
    }),

    paymentMethod: Joi.string().valid("cod", "sslCommerZ").required().messages({
      "string.empty": "Payment method is required",
      "any.only": "Payment method must be one of: cod or sslCommerZ",
    }),
  },
  { abortEarly: true }
).unknown(true);

const validateOrder = async (req) => {
  try {
    const value = await orderValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log(
      "error",
      error.details?.map((err) => err.message)
    );
    throw new customError(
      401,
      "Order validation error: " + error.details?.map((err) => err.message)
    );
  }
};

module.exports = { validateOrder };
