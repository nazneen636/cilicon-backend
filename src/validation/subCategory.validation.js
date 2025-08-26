const Joi = require("joi");
const mongoose = require("mongoose");
const { customError } = require("../helpers/customError");
const subCategoryValidationSchema = Joi.object(
  {
    name: Joi.string().trim().min(3).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name must not exceed 50 characters",
      "string.base": "Name must be a text",
      "any.required": "Name is required",
    }),

    category: Joi.string()
      .trim()
      .required()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .messages({
        "any.invalid": "Category must be a valid MongoDB ObjectId",
        "string.empty": "Category is required",
        "any.required": "Category is required",
      }),
  },
  { abortEarly: true }
);
exports.validateSubCategory = async (req) => {
  try {
    const value = subCategoryValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log(
      "error",
      error.details.map((item) => item.message)
    );

    throw new customError(
      401,
      error.details.map((item) => item.message)
    );
  }
};
