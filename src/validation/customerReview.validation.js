const Joi = require("joi");
const { customError } = require("../helpers/customError");
const { validate } = require("../models/product.model");

const reviewValidationSchema = Joi.object({
  reviewerId: Joi.string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.base": "Reviewer Id must be a string",
      "string.empty": "Reviewer Id cannot be empty",
      "any.required": "Reviewer Id is required",
      "string.pattern.base": "Reviewer Id must be a valid ObjectId",
    }),
  productId: Joi.string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.base": "Product Id must be a string",
      "string.empty": "Product Id cannot be empty",
      "any.required": "Product Id is required",
      "string.pattern.base": "Product Id must be a valid ObjectId",
    }),

  comment: Joi.string().trim().min(3).max(500).required().messages({
    "string.base": "Comment must be a string",
    "string.empty": "Comment cannot be empty",
    "string.min": "Comment must be at least 3 characters long",
    "string.max": "Comment cannot exceed 500 characters",
    "any.required": "Comment is required",
  }),

  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
    "any.required": "Rating is required",
  }),

  image: Joi.array()
    .items(Joi.object().unknown(true)) // allow any object inside array
    .optional()
    .messages({
      "array.base": "Image must be an array",
    }),
});

const validateCustomerReview = async (req) => {
  try {
    const value = await reviewValidationSchema.validateAsync(req.body);

    const image = req?.files?.image;
    const allowFormat = ["image/jpg", "image/png", "image/jpeg"];

    if (image && image.length > 10) {
      throw new customError(401, "You can upload a maximum of 10 images");
    }
    if (image) {
      image.forEach((img) => {
        if (img.size > 1024 * 1024 * 5) {
          throw new customError(401, "Each image must be below 5 MB");
        }
        if (!allowFormat.includes(img.mimetype)) {
          throw new customError(401, "Invalid format (use JPG, PNG, or JPEG)");
        }
      });
    }
    return { ...value, image: image || [] };
  } catch (error) {
    const message =
      error.details?.map((err) => err.message).join(", ") ||
      error.message ||
      "Validation failed";

    throw new customError(401, "Customer review validation error: " + message);
  }
};
module.exports = { validateCustomerReview };
