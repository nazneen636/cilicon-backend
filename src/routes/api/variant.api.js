const express = require("express");
const _ = express.Router();
const variantController = require("../../controller/variant.controller");
const { upload } = require("../../middleware/multer.middle");
_.route("/create-variant").post(
  upload.fields([{ name: "images", maxCount: 10 }]),
  variantController.createVariant
);
_.route("/all-variant").get(variantController.getAllVariant);
_.route("/update-variant/:slug").put(
  upload.fields([{ name: "images", maxCount: 10 }]),
  variantController.updateVariant
);

module.exports = _;
