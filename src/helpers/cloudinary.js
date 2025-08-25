const cloudinary = require("cloudinary");
require("dotenv").config();
const { customError } = require("./customError");
const fs = require("fs");

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_Key,
  api_secret: process.env.API_SECRET,
});

exports.uploadCloudinaryFile = async (filePath) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      throw new customError("401", "Image file path missing");
    } // Upload the image
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      quality: "auto",
    });
    if (response) {
      fs.unlinkSync(filePath);
    }
    // const url = await cloudinary.url(response.public_id, {
    //   resource_type: "image",
    //   quality: "auto",
    // });
    return { publicId: response.public_id, url: response.secure_url };
  } catch (err) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new customError(500, "Failed to upload " + err.message);
  }
};

exports.deleteCloudinary = async (filePath) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (err) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new customError(500, "Failed to update category " + err.message);
  }
};
