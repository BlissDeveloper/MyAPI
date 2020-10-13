const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const { count } = require("../models/orders");
const router = express.Router();

const Order = require("../models/orders");
const Product = require("../models/products");
const OrderResponse = require("../models/order_response");

router.get("/", (req, res, next) => {
  Order.find()
    .select("-_id -__v")
    .populate("product", "-_id -__v")
    .exec()
    .then((doc) => {
      const response = new OrderResponse({
        count: doc.length,
        orders: doc,
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
  const productId = req.body.productId;
  Product.findById(productId)
    .exec()
    .then((doc) => {
      if (doc) {
        const id = new mongoose.Types.ObjectId();
        const order = new Order({
          _id: id,
          orderId: id,
          quantity: req.body.quantity,
          product: doc._id,
          total: req.body.quantity * doc.price,
        });
        order
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              orderId: result._id,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: error.message,
            });
          });
      } else {
        console.log("Not found");
        res.status(500).json({
          message: "No product found with provided ID.",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .select("-_id -__v")
    .populate('product', "-_id -__v" )
    .exec()
    .then((doc) => {
      if (doc) {
        const orderArray = [];
        orderArray.push(doc);
        res.status(200).json({
          count: orderArray.length,
          orders: orderArray,
        });
      } else {
        res.status(404).json({
          message: "No order found with provided ID.",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
});

module.exports = router;
