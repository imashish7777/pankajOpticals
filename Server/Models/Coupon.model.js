const mongoose = require("mongoose");

var couponSchema = mongoose.Schema({
  name: {
    type: String,
    uppercase: true,
  },
  expriry: {
    type: Date,
  },
  discount: {
    type: Number,
  },
  upTo: {
    type: Number,
  },
  discribtion: { type: String },
});

module.exports = couponModel = mongoose.model("coupons", couponSchema);
