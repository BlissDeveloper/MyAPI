const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      const id = new mongoose.Types.ObjectId();
      const user = User({
        _id: id,
        userId: id,
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            userId: result._id,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(422).json({
            message: error.message,
          });
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email })
    .exec()
    .then((doc) => {
      if (doc) {
        const hashPass = doc.password;
        const plainPass = req.body.password;
        bcrypt.compare(plainPass, hashPass, (error, isMatched) => {
          if (isMatched) {
           const token =  jwt.sign(
              {
                email: doc.email,
                userId: doc.userId,
              },
              process.env.JWT_KEY,
              {
                  expiresIn: "1h"
              }
            );
            res.status(200).json({
                message: "Auth successful",
                token: token
              });
          } else {
            res.status(401).json({
              message: "Auth failed",
            });
          }
        });
      } else {
        res.status(401).json({
          message: "Auth failed",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
});

router.get("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(req.params);
  User.findById(userId)
    .select("userId email -_id")
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
});

module.exports = router;
