const userModel = require("../Models/User.model");
const cartModel = require("../Models/Cart.model");
const orderModel = require("../Models/Order.model");
const jwt = require("jsonwebtoken");
const AsynceHandler = require("express-async-handler");
const { generateToken, generateRefreshToken } = require("../Configs/jwtToken");
const { jwtSecret, clientUrl } = require("../Configs/env");
const { validateMongoDbId } = require("../utils/validateMongodbid");
const crypto = require("crypto");

const QueryModel = require("../Models/Query.model");

///user authtication///

module.exports.isAuthicated = AsynceHandler(async (req, res) => {
  const userId = req.user;

  if (userId) {
    res.json("true");
  }
});

//SIGN UP////
module.exports.SIGNUP = AsynceHandler(async (req, res) => {
  const { firstname, lastname, email, mobileNumber, password } = req.body;

  try {
    await userModel
      .create({ firstname, lastname, email, mobileNumber, password })
      .then((user) => {
        res.json({ user: true });
      });
  } catch (error) {
    res.json({
      status: "error",
      error: "Dupcicate Email or Number",
      user: false,
    });
  }
});

//LOGIN///

module.exports.LOGIN = AsynceHandler(async (req, res) => {
  const password = req.body.password;
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (user && (await user.isPasswordMatched(password))) {
    var token = await generateToken(user?._id);
    var refreshtoken = await generateRefreshToken(user?._id);
    user.refreshtoken = refreshtoken;
    await user.save();
    res
      .cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .json({
        user: {
          firstname: user?.firstname,
          lastname: user?.lastname,
          email: user?.email,
          mobileNumber: user?.mobileNumber,
          token: token,
        },
      });
  } else {
    return res.json({ status: "error", user: false });
  }
});

///logout///

module.exports.LOGOUT = AsynceHandler(async (req, res) => {
  const { refreshtoken } = req.cookies;
  const user = await userModel.findOne({ refreshtoken: refreshtoken });
  if (!user) {
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await userModel.findOneAndUpdate({ refreshtoken }, { refreshtoken: "" });
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

///password update////

module.exports.UPDATE_PASSWORD = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const password = req.body.password;
  const oldpassword = req.body.oldpassword;

  try {
    const user = await userModel.findById(_id);

    if (user && (await user.isPasswordMatched(oldpassword))) {
      user.password = password;
      const updatepassword = await user.save();
      res.json("update Successfully");
    } else {
      res.json("couldn't update");
    }
  } catch {
    res.json("BAD REQST");
  }
});

///RESET PASSOWRD LINK GENERATION////
module.exports.FORGOT_PASSWORD_TOKEN = AsynceHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("user not found with this email");
  try {
    const token = await user.createPasswordToken();

    await user.save();
    const resetURL = `Hi, follow this link for reset password <a href="${clientUrl()}/auth/resetpassword/${token}"></a>`;
    const data = {
      to: email,
      subject: "forgot password link",
      text: "Hey user",
      htm: resetURL,
    };
    // sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

//RESET PASSWORD///
module.exports.RESET_PASSWORD = AsynceHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const resetToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetToken: resetToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) throw new Error("Token Expired,please login later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();
  res.json(user);
});

//DELETE_ACCOUNT///
module.exports.DELETE_ACCOUNT = AsynceHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    await cartModel.findOneAndDelete({ userId: userId });
    await wishlistModel.findOneAndDelete({ userId: userId });
    await orderModel.findOneAndDelete({ userId: userId });
    await userModel.findByIdAndDelete(userId);
    res.json({ status: "userdelete" });
  } catch {
    res.json({ status: "cannot delete" });
  }
});

///EMAIL_UPDATE///
module.exports.UPDATE_ACCOUNT = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    await userModel
      .findByIdAndUpdate(
        _id,
        {
          lastname: req?.body?.lastname,
          gender: req?.body?.gender,
        },
        {
          new: true,
        }
      )
      .then((user) => res.json(user))
      .catch({ status: "can't update" });
  } catch {
    res.json({ status: "ERORR OCCURS" });
  }
});

///FETCH_ADDRESS///
//100-200ms//
module.exports.FETCH_ADDRESS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await userModel
      .findById(_id)
      .select("addresses")
      .lean();

    res.send(user.addresses);
  } catch {
    res.status(404);
  }
});

//ADD_NEW_ADDRESS//
//150-200ms//
module.exports.ADD_ADDRESS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const {
    firstname,
    lastname,
    phone,
    addresslineOne,
    addresslineTwo,
    state,
    zip,
    city,
  } = req.body;
  try {
    const user = await userModel.findByIdAndUpdate(
      _id,
      {
        $push: {
          addresses: {
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        addresslineOne: addresslineOne,
        addresslineTwo: addresslineTwo,
        zip: zip,
        state: state,
        city: city,
          },
        },
      },
      { new: true, select: "addresses" }
    );

    return res.send(user.addresses).status(201);
  } catch {
    res.status(404);
  }
});

//DELETE ADDRESSS///
//200-300ms//
module.exports.DELETE_ADDRESS = AsynceHandler(async (req, res) => {
  const id = req.params.id;
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await userModel.findByIdAndUpdate(
      _id,
      {
        $pull: {
          addresses: { _id: id },
        },
      },
      { new: true, select: "addresses" }
    );

    if (user) {
      return res.send(user.addresses);
    }
  } catch {
    return res.status(404).json("couldn't delete");
  }
});

//UPDATE ADDRESS//
//200-300ms//
module.exports.UPDATA_ADDRESS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const { addressId } = req.params;

  try {
    const addressFields = [
      "firstname",
      "lastname",
      "phone",
      "addresslineOne",
      "addresslineTwo",
      "city",
      "state",
      "zip",
    ];

    const $set = addressFields.reduce((fields, key) => {
      if (req?.body?.[key]) {
        fields[`addresses.$.${key}`] = req.body[key];
      }

      return fields;
    }, {});

    if (!Object.keys($set).length) {
      const user = await userModel
        .findById(_id)
        .select("addresses");

      return res.send(user.addresses);
    }

    const user = await userModel.findOneAndUpdate(
      { _id, "addresses._id": addressId },
      { $set },
      { new: true, select: "addresses" }
    );

    if (user) {
      return res.send(user.addresses);
    }
  } catch {
    return res.status(500).send("couldn't updata addrss");
  }
});

///refresh token/////
module.exports.REFRESH_TOKEN = AsynceHandler(async (req, res) => {
  var cookie = req.cookies;
  if (!cookie?.refreshtoken) {
    throw new Error("not refresh token");
  }
  const refreshtoken = cookie.refreshtoken;

  var user = await userModel.findOne({ refreshtoken });
  if (!user) throw new Error("no refresh token in database");
  const decode = jwt.verify(refreshtoken, jwtSecret());
  if (user._id.toString() !== decode._id) {
    throw new Error("Refreshtoken expire");
  }
  const accesstoken = await generateToken(user._id);
  res.json(accesstoken);
});

module.exports.ASK_QUERY = AsynceHandler(async (req, res) => {
  try {
    const qurey = await QueryModel.create(req.body);
    res.sendStatus(200);
  } catch (error) {
    throw new Error(error);
  }
});
