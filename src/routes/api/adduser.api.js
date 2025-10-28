const express = require("express");
const _ = express.Router();
const addUserPermissionController = require("../../controller/adduserPermission.controller");
const { upload } = require("../../middleware/multer.middle");

_.route("/adduser/").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  addUserPermissionController.addUser
);

module.exports = _;
