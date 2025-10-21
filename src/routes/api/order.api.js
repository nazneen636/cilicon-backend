const express = require("express");
const _ = express.Router();
const orderController = require("../../controller/order.controller");

_.route("/create-order").post(orderController.createOrder);
_.route("/all-order").get(orderController.getAllOrder);
_.route("/update-order/:id").put(orderController.updateOrderStatus);
_.route("/order-status").get(orderController.getTotalOrderStatusUpdate);
_.route("/courier-send").post(orderController.createOrderCourier);

module.exports = _;
