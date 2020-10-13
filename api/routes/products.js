const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const { count } = require("../models/products");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  //Reject a file
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("File type is not supported."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

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

router.post("/", upload.single("productImage"), (req, res, next) => {
  const id = new mongoose.Types.ObjectId();
  const path = req.file.path;
  const newPath = path.replace("\\", "/");
  const product = new Product({
    _id: id,
    name: req.body.name,
    price: req.body.price,
    productId: id,
    productImage: newPath,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        productId: result._id,
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
      res.status(200).json({
        message: err.message,
      });
    });
});

module.exports = router;
