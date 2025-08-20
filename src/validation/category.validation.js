const Joi = require("joi");
const { customError } = require("../helpers/customError");
const categoryValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const validateCategory = async (req) => {
  try {
    const value = await categoryValidationSchema.validateAsync(req.body);
    const image = req?.files?.image[0];
    const allowFormat = ["image/jpg", "image/png", "image/jpeg"];
    if (image?.length > 1) {
      throw new customError(401, "image must be single");
    }
    if (image?.size > 40000) {
      throw new customError(401, "image size upload below 4mb");
    }
    if (!allowFormat.includes(image?.mimetype)) {
      throw new customError(401, "image don't support the format");
    }
    return value;
  } catch (error) {
    if (error.data == null) {
      throw new customError(401, error);
    } else {
      console.log(
        "error",
        error,
        error?.details?.map((err) => err.message)
      );
      throw new customError(
        401,
        "category validation error " + error.details.map((err) => err.message)
      );
    }
  }
};

module.exports = { validateCategory };
