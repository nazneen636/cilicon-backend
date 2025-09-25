const express = require("express");
const _ = express.Router();
const reviewController = require("../../controller/customerReview.controller");
const { upload } = require("../../middleware/multer.middle");
_.route("/create-review").post(
  upload.fields([{ name: "images", maxCount: 10 }]),
  reviewController.createReview
);

module.exports = _;
