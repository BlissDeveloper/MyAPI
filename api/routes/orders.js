const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/orders");
const OrderResponse = require('../models/order_response');

router.get("/", (req, res, next) => {
  Order.find()
    .select("-_id -__v")
    .exec()
    .then((docs) => {
        
    })
    .catch((error) => {
        res.status(500).json({
            message: error.message
        });
    });
});

router.post("/", (req, res, next) => {
  const order = new Order({
    orderId: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    productId: req.body.productId,
  });
  order
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        orderId: result.orderId,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
});

module.exports = router;
