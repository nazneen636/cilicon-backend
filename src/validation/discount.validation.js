const Joi = require("joi");
const { customError } = require("../helpers/customError");

const discountValidationSchema = Joi.object(
  {
    discountValidFrom: Joi.date().required().messages({
      "date.base": "Discount valid from must be a valid date",
      "any.required": "Discount valid from date is required",
    }),

    discountValidTo: Joi.date()
      .greater(Joi.ref("discountValidFrom"))
      .required()
      .messages({
        "date.base": "Discount valid to must be a valid date",
        "date.greater": "Discount valid to must be later than valid from date",
        "any.required": "Discount valid to date is required",
      }),

    discountName: Joi.string().trim().min(3).max(50).required().messages({
      "string.empty": "Discount name is required",
      "string.min": "Discount name must be at least 3 characters long",
      "string.max": "Discount name must not exceed 50 characters",
      "any.required": "Discount name is required",
    }),

    discountType: Joi.string().valid("tk", "percentage").required().messages({
      "any.only": "Discount type must be either 'tk' or 'percentage'",
      "any.required": "Discount type is required",
    }),

    discountValueByAmount: Joi.number().min(0).messages({
      "number.base": "Discount value by amount must be a number",
      "number.min": "Discount value by amount cannot be negative",
    }),

    discountValueByPercentage: Joi.number().min(0).max(100).messages({
      "number.base": "Discount value by percentage must be a number",
      "number.min": "Discount percentage cannot be negative",
      "number.max": "Discount percentage cannot exceed 100",
    }),

    discountPlan: Joi.string()
      .valid("category", "subCategory", "product")
      .required()
      .messages({
        "any.only":
          "Discount plan must be either 'category', 'subCategory', or 'product'",
        "any.required": "Discount plan is required",
      }),

    // category: Joi.string().optional(),
    // subCategory: Joi.string().optional(),
    // product: Joi.string().optional(),

    isActive: Joi.boolean().optional().messages({
      "boolean.base": "isActive must be true or false",
    }),
  },
  { abortEarly: true }
).unknown(true);

const validateDiscount = async (req) => {
  try {
    const value = await discountValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log(
      "error",
      error.details?.map((err) => err.message)
    );
    throw new customError(
      401,
      "discount validation error " + error.details?.map((err) => err.message)
    );
  }
};

module.exports = { validateDiscount };
