const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoute = require("./api/routes/products");
const orderRoute = require("./api/routes/orders");

mongoose.connect(
  "mongodb+srv://admin:" +
    process.env.MONGO_ATLAS_PW +
    "@grocery-app.r6bk4.gcp.mongodb.net/" +
    process.env.DB_NAME +
    "?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use('/uploads', express.static('uploads'));
//Logging interceptor
app.use(morgan("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET", "POST");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoute);
app.use("/orders", orderRoute);

//next() passes the variable to the next request
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//Error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});

module.exports = app;
