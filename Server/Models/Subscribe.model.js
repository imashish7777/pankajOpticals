const mongoose = require("mongoose");

const SubscribeSchema = new mongoose.Schema({
  email: { type: String },
});

module.exports = SubscribeModel = mongoose.model(
  "subscribers",
  SubscribeSchema
);
