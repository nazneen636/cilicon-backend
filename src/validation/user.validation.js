const Joi = require("joi");
const { customError } = require("../helpers/customError");
const userValidationSchema = Joi.object(
  {
    name: Joi.string().empty().min(5).max(20).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 5 characters long",
      "string.max": "Name must not exceed 20 characters",
      "string.base": "Name must be a text",
    }),
    email: Joi.string()
      .trim()
      .pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
      .required()
      .empty()
      .messages({
        "string.empty": "Email is required",
        "string.pattern.base": "Email format is invalid",
        "string.email.missingAt": "Email must contain '@' symbol",
        "string.email.invalidDomain": "Email domain format is invalid",
        "string.email.invalidTLD":
          "Top-level domain must have at least 2 letters",
      }),
    phone: Joi.string()
      .trim()
      .pattern(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/)
      .empty()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base":
          "Phone number must be valid and follow the format (e.g., 017XXXXXXXX or +88017XXXXXXXX)",
      }),
    password: Joi.string()
      .trim()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .empty()
      .messages({
        "string.empty": "Password is required",
        "string.pattern.base":
          "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
  },
  { abortEarly: true }
).unknown(true);

const validateUser = async (req) => {
  try {
    const value = await userValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log(
      "error",
      error.details.map((err) => err.message)
    );
    throw new customError(
      401,
      "user validation error " + error.details.map((err) => err.message)
    );
  }
};
module.exports = { validateUser };
