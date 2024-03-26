const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
   
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
   
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
    user : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // createdAt:{
    //   type : Date
    // },
    // updatedAt:{
    //   type : Date
    // },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;