const mongoose = require("mongoose");
const OrderModel = require("./Order.model");

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  slug: {
    type: String,
    lowerCase: true,
  },
  Brand: { type: String, lowerCase: true },
  mPrice: { type: Number },
  thumnailimages: { type: Array },
  images: { type: Array },
  sold: { type: Number, default: 0 },
  quantity: { type: Number },
  size: { type: String },
  color: { type: Array },
  frameType: { type: String },
  shape: { type: String },
  gender: { type: String },

  date_added: {
    type: Date,
    default: Date.now,
  },

  wishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "users"}],
  carts: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      count: Number,
    },
  ],
  cartcount: { type: Number, default: 0 },
  wishlistcount: { type: Number, default: 0 },
  ordercount: { type: Number, default: 0 },

  orders: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      count: Number,
    },
  ],
  returns: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      count: Number,
    },
  ],
  views: { type: Number, default: 0 },

  ratings: [
    {
      star: Number,
      comment: String,
      postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  name: String,

  category: String,

  totolratings: {
    type: Number,
    default: 0,
  },
});

module.exports = productModel = mongoose.model("products", ProductSchema);
