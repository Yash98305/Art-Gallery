const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    productId:[]
  }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;