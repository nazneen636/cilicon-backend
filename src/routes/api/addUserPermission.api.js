const express = require("express");
const _ = express.Router();
const addUserPermissionController = require("../../controller/adduser.controller");
const { upload } = require("../../middleware/multer.middle");
const { authgurd } = require("../../middleware/auth.middleware");

_.route("/adduserpermission").post(
  authgurd,
  addUserPermissionController.addPermissionToUser
);

module.exports = _;
