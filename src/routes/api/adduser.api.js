const express = require("express");
const _ = express.Router();
const addUserUserController = require("../../controller/adduser.controller");
const { upload } = require("../../middleware/multer.middle");
const { authgurd } = require("../../middleware/auth.middleware");
const { autorize } = require("../../middleware/authorize.middleware");

_.route("/adduser/").post(
  authgurd,
  autorize,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addUserUserController.addUser
);
_.route("/all-user").get(addUserUserController.getAllUser);

module.exports = _;
