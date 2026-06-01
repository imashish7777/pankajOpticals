const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: Number,
    },
  ],
  paymentIntet: {},
  orderStatus: {
    type: String,
    default: "Not processed",
    enum: [
      "Not processed",
      "processing",
      "payment pending",
      "ordered",
      "Dispacted",
      "Cancelled",
      "Delivered",
      "Return",
    ],
  },

  orderDate: String,
  updatedDate: String,

  shippingAddress: { type: Object },
  bill: { type: Object },
  CouponApplied: { type: Object },

  orderby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
},{
  timestamps:true,
});

module.exports = orderModel = mongoose.model("orders", orderSchema);
