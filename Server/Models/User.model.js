const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, text: true },
  lastname: { type: String, required: true, text: true },
  mobileNumber: { type: Number },
  email: { type: String, required: true, unique: true, text: true },
  password: { type: String, required: true },
  gender: { type: String },
  role: { type: String, default: "user" },
  isblocked: { type: Boolean, default: false },
  refreshtoken: {
    type: String,
  },
  passwordResetToken: { type: String },
  passwordChangedAt: { type: Date },
  passwordResetExpire: { type: Date },

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  order: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],

  addresses: [
    {
      firstname: { type: String },
      lastname: { type: String },
      phone: { type: Number },
      addresslineOne: { type: String },
      addresslineTwo: { type: String },
      zip: { type: Number },
      city: { type: String },
      state: { type: String },
    },
  ],

  register_date: {
    type: Date,
    default: Date.now,
  },

  timeStamps: {
    type: Array,
    default: Date.now,
    new: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

userSchema.methods.createPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpire = Date.now() + 10 * 30 * 60 * 10000; ///10min
  return resetToken;
};

const userModal = mongoose.model("users", userSchema);

module.exports = userModal;
