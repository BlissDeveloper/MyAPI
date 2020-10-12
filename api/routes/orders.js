const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const { count } = require("../models/orders");
const router = express.Router();

const Order = require("../models/orders");
const OrderResponse = require("../models/order_response");

router.get("/", (req, res, next) => {
  Order.find()
    .select("-_id -__v")
    .exec()
    .then((docs) => {
      const response = new OrderResponse({
        count: docs.length,
        orders: docs,
      });
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
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

router.get("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;
  Order.find({
    orderId: orderId,
  })
    .exec()
    .then((doc) => {
      if(doc.length > 0) {
        const orderArray = [];
        orderArray.push(doc);
        res.status(200).json({
          count: orderArray.length,
          orders: orderArray
        });
      }
      else {
        res.status(404).json({
          message: "No order found with provided ID."
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message
      });
    });
});

module.exports = router;
