const mongoose = require("mongoose");

const connection = mongoose.connect(process.env.PankajopticalsDB_URL);

module.exports = { connection };
