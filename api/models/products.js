const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productId: mongoose.Schema.Types.ObjectId,
  productImage: {type: String, required: true}
});

module.exports = mongoose.model("Product", productSchema);
