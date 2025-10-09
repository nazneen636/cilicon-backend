const express = require("express");
const _ = express.Router();
const DeliveryChargeController = require("../../controller/deliveryCharge.controller");
_.route("/create-delivery-charge").post(
  DeliveryChargeController.createDeliveryCharge
);
_.route("/all-delivery-charge").get(
  DeliveryChargeController.getAllDeliveryCharge
);
_.route("/single-delivery-charge/:_id").get(
  DeliveryChargeController.singleDeliveryCharge
);
_.route("/update-delivery-charge/:_id").put(
  DeliveryChargeController.updateDeliveryCharge
);
_.route("/delete-delivery-charge/:id").delete(
  DeliveryChargeController.deleteDeliveryCharge
);

module.exports = _;
//
