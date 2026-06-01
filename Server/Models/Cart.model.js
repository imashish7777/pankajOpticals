const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },

      quantity: Number,
    },
  ],
  cartTotal: Number,
  totalAfterDiscount: Number,

  CouponApplied: { type:Object},
  
  orderby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;
