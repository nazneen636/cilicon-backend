const Joi = require("joi");
const { customError } = require("../helpers/customError");

// Product Validation Schema
const productValidationSchema = Joi.object(
  {
    name: Joi.string().trim().min(3).max(100).required().messages({
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 3 characters long",
      "string.max": "Product name must not exceed 100 characters",
      "any.required": "Product name is required",
    }),

    description: Joi.string().trim().optional().messages({
      "string.base": "Description must be text",
    }),

    tag: Joi.array().items(Joi.string().trim()).optional(),

    manufactureCountry: Joi.string().trim().optional(),

    rating: Joi.number().min(0).max(5).optional().messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating cannot be less than 0",
      "number.max": "Rating cannot exceed 5",
    }),

    availabilityStatus: Joi.boolean().optional(),

    sku: Joi.string().trim().required().messages({
      "string.empty": "SKU is required",
      "any.required": "SKU is required",
    }),

    barCode: Joi.string().trim().optional(),
    qrCode: Joi.string().trim().optional(),

    groupUnit: Joi.string()
      .valid("Box", "Packet", "Dozen", "Custom")
      .optional()
      .messages({
        "any.only": "Group unit must be Box, Packet, Dozen, or Custom",
      }),

    groupUnitQuantity: Joi.number().min(1).optional(),

    unit: Joi.string()
      .valid("Piece", "Kg", "litre", "Gram")
      .optional()
      .messages({
        "any.only": "Unit must be Piece, Kg, litre, or Gram",
      }),

    size: Joi.array().items(Joi.string().trim()).optional(),
    color: Joi.array().items(Joi.string().trim()).optional(),

    totalStock: Joi.number().min(0).default(0).messages({
      "number.min": "Stock cannot be negative",
    }),

    purchasePrice: Joi.number().min(0).required().messages({
      "number.base": "Purchase price must be a number",
      "any.required": "Purchase price is required",
    }),

    retailPrice: Joi.number().min(0).required().messages({
      "number.base": "Retail price must be a number",
      "any.required": "Retail price is required",
    }),

    retailProfitMarginByPercentage: Joi.number().min(0).max(100).optional(),

    wholeSalePrice: Joi.number().min(0).optional(),
    wholeSaleProfitMarginByPercentage: Joi.number().min(0).max(100).optional(),

    minWholeSaleOrderQuantity: Joi.number().min(1).default(1),
    minOrder: Joi.number().min(1).default(1),

    inStock: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),

    category: Joi.string().required().messages({
      "string.empty": "Category is required",
      "any.required": "Category is required",
    }),

    subCategory: Joi.string().optional(),
    brand: Joi.string().optional(),
  },
  { abortEarly: true }
).unknown(true);

// Product validation function
const validateProduct = async (req) => {
  try {
    const value = await productValidationSchema.validateAsync(req.body);

    // image validation
    const images = req?.files?.image;
    const allowFormat = ["image/jpg", "image/png", "image/jpeg"];

    if (images && images.length > 5) {
      throw new customError(
        401,
        "You can upload a maximum of 5 product images"
      );
    }

    if (images) {
      images.forEach((img) => {
        if (img.size > 1024 * 1024 * 5) {
          throw new customError(401, "Each image must be below 5 MB");
        }
        if (!allowFormat.includes(img.mimetype)) {
          throw new customError(401, "Invalid format (use JPG, PNG, or JPEG)");
        }
      });
    }

    return { ...value, images: images || [] };
  } catch (error) {
    throw new customError(
      401,
      "product validation error " + error.details?.map((err) => err.message)
    );
  }
};

module.exports = { validateProduct };
