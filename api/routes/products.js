const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { count } = require("../models/products");

const Product = require("../models/products");
const ProductResponse = require("../models/product_response");

router.get("/", (req, res, next) => {
  Product.find()
    .select("-_id -__v")
    .exec()
    .then((docs) => {
      const response = new ProductResponse({
        count: docs.length,
        products: docs,
      });
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    productId: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        productId: product.productId,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .select("-_id -__v")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        const docArray = [];
        docArray.push(doc);
        const response = new ProductResponse({
          count: docArray.length,
          products: docArray,
        });
        console.log(doc);
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No product found with provided ID.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

module.exports = router;
