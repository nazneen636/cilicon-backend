const Joi = require("joi");

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

module.exports = { reviewValidationSchema };
