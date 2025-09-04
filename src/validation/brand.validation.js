const Joi = require("joi");
const { customError } = require("../helpers/customError");

const brandValidationSchema = Joi.object(
  {
    name: Joi.string().trim().min(3).max(30).required().messages({
      "string.empty": "Brand name is required",
      "string.min": "Brand name must be at least 3 characters long",
      "string.max": "Brand name must not exceed 30 characters",
      "any.required": "Brand name is required",
    }),

    color: Joi.string().trim().optional().messages({
      "string.base": "Color must be a text",
    }),

    icon: Joi.string().trim().optional().messages({
      "string.base": "Icon must be a text",
    }),

    isActive: Joi.boolean().optional().messages({
      "boolean.base": "isActive must be true or false",
    }),
  },
  { abortEarly: true }
).unknown(true);

const validateBrand = async (req) => {
  try {
    const value = await brandValidationSchema.validateAsync(req.body);

    // image validation
    const image = req?.files?.image?.[0];
    const allowFormat = ["image/jpg", "image/png", "image/jpeg"];

    if (req?.files?.image?.length > 1) {
      throw new customError(401, "Only one brand image is allowed");
    }
    if (image?.size > 1024 * 1024 * 5) {
      throw new customError(401, "Brand image size must be below 5 MB");
    }
    if (image && !allowFormat.includes(image?.mimetype)) {
      throw new customError(
        401,
        "Brand image format not supported (use JPG, PNG, or JPEG)"
      );
    }

    return { ...value, image };
  } catch (error) {
    console.log(
      "error",
      error.details?.map((err) => err.message)
    );
    throw new customError(
      401,
      "brand validation error " + error.details?.map((err) => err.message)
    );
  }
};

module.exports = { validateBrand };
