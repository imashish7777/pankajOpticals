const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    query: { type: String },
  },
  {
    timestamps: true,
  }
);

const QueryModel = mongoose.model("Queries", QuerySchema);

module.exports = QueryModel;
