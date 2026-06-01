const AsynceHandler = require("express-async-handler");
const OrderModel = require("../Models/Order.model");
const userModel = require("../Models/User.model");
const { validateMongoDbId } = require("../utils/validateMongodbid");

const cartModel = require("../Models/Cart.model");
const couponModel = require("../Models/Coupon.model");
const productModel = require("../Models/Product.model");
const PropertiesModel = require("../Models/Properties.model");
const jwt = require("jsonwebtoken");
const { generateToken, generateRefreshToken } = require("../Configs/jwtToken");
const { jwtSecret, adminUrl } = require("../Configs/env");
const crypto = require("crypto");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

//=====================================================================ADMIN authrization controll==============================================================================>

//admin authication//
module.exports.ISAUTHICATED = AsynceHandler(async (req, res) => {
  const userId = req.user;

  if (userId) {
    res.json("true");
  }
});

//admin login///
module.exports.LOGIN = AsynceHandler(async (req, res) => {
  const password = req.body.password;
  const user = await userModel.findOne({
    email: req.body.email,
  });
  if (user.role !== "admin") {
    res.json("you dont't have authorization on this action");
  } else if (user && (await user.isPasswordMatched(password))) {
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
          token: token,
          firstname: user?.firstname,
          lastname: user?.lastname,
          email: user?.email,
        },
      });
  } else {
    return res.json({ status: "error", user: false });
  }
});

///admin logout///

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

///admin refresh token/////
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

///admin update account///
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
  } catch (error) {
    throw new Error(error);
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
    const resetURL = `Hi, follow this link for reset password <a href="${adminUrl()}/auth/resetpassword/${token}"></a>`;
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

//====================================================================CUSTOMERS CONTROLL=============================================================================>

///FETCH ALL CUSTOMERS///
module.exports.FETCH_CUSTOMERS = AsynceHandler(async (req, res) => {
  if (req.body.search) {
    const search = req.body.search.toLocaleLowerCase().trim().split(" ");

    if (search.length == 1) {
      try {
        await userModel
          .find({
            $or: [
              {
                firstname: { $regex: search[0] },
              },
              {
                lastname: { $regex: search[0] },
              },
              {
                email: { $regex: search[0] },
              },
              // {
              //   mobileNumber: search[0],
              // },
            ],
          })
          .sort({ firstname: 1 })
          .then((users) => res.json(users))
          .catch((err) => res.json({ status: "404 NOT FOUND" }));
      } catch {
        res.json({ status: "ERROR OCCURS" });
      }
    } else if (search.length == 2) {
      try {
        await userModel
          .find({
            $or: [
              {
                $and: [
                  {
                    firstname: { $regex: search[0] },
                  },
                  {
                    lastname: { $regex: search[1] },
                  },
                ],
              },

              {
                $and: [
                  {
                    firstname: { $regex: search[1] },
                  },
                  {
                    lastname: { $regex: search[0] },
                  },
                ],
              },
            ],
          })
          .sort({ firstname: 1 })
          .then((users) => res.json(users))
          .catch((err) => res.json({ status: "404 NOT FOUND" }));
      } catch {
        res.json({ status: "ERROR OCCURS" });
      }
    } else {
      try {
        await userModel
          .find()
          .sort({ firstname: 1 })
          .then((users) => res.json(users))
          .catch((err) => res.json({ status: "404 NOT FOUND" }));
      } catch {
        res.json({ status: "ERROR OCCURS" });
      }
    }
  } else {
    try {
      await userModel
        .find()
        .sort({ firstname: 1 })
        .then((users) => res.json(users))
        .catch((err) => res.json({ status: "404 NOT FOUND" }));
    } catch {
      res.json({ status: "ERROR OCCURS" });
    }
  }
});

//BLOCK ONE CUSTOMER
module.exports.BLOCK_CUSTOMER = AsynceHandler(async (req, res) => {
  const { _id } = req.body;
  try {
    const blockeduser = await userModel.findByIdAndUpdate(
      _id,
      {
        isblocked: true,
      },
      { new: true }
    );
    res.json(blockeduser);
  } catch {
    res.json("BAD_REQUEST");
  }
});

//Unblock one user///
module.exports.UNBLOCK_CUSTOMER = AsynceHandler(async (req, res) => {
  const { _id } = req.body;
  try {
    const Unblockeduser = await userModel.findByIdAndUpdate(
      _id,
      {
        isblocked: false,
      },
      { new: true }
    );
    res.json(Unblockeduser);
  } catch {
    res.json("BAD_REQUEST");
  }
});

///DELETE ONE CUSTOMERS///
module.exports.DELETE_ONE_CUSTOMER = AsynceHandler(async (req, res) => {
  // const userId = req.user._id;

  try {
    await cartModel.findOneAndDelete({ userId: userId });
    await wishlistModel.findOneAndDelete({ userId: userId });
    await OrderModel.findOneAndDelete({ userId: userId });
    await userModel.findByIdAndDelete(userId);
    res.json({ status: "userdelete" });
  } catch {
    res.json({ status: "cannot delete" });
  }
});

//FETCH ON CUSTOMER DETAILS//
module.exports.FETCH_CUSTOMER_DETAILS = AsynceHandler(async (req, res) => {
  const { _id } = req.body;
  try {
    const userdata = await userModel
      .findById(_id, {
        password: 0,
        wishlist: 0,
        cart: 0,
      })
      .populate({
        path: "order",
        populate: {
          path: "products.product",
          model: "products",
        },
      });
    res.send(userdata);
  } catch {
    res.json({ status: "ERROR OCCURS" });
  }
});

//============================================================================ORDER CONTROLLS============================================================================>
//admin fetch orders////=

module.exports.FETCH_ORDERS_ANALYSIS = AsynceHandler(async (req, res) => {
  const selectedYear = req.query?.year?.toString();
  const ordersAnalysis = await OrderModel.find(
    {},
    {
      paymentIntet: 1,
      bill: 1,
    }
  );

  if (ordersAnalysis) {
    var January = [];
    var February = [];
    var March = [];
    var April = [];
    var May = [];
    var June = [];
    var July = [];
    var August = [];
    var September = [];
    var October = [];
    var November = [];
    var December = [];

    ordersAnalysis
      .filter((i) => {
        if (!selectedYear) {
          return true;
        }
        return i.paymentIntet?.paymentDate?.toString().includes(selectedYear);
      })
      .map((i) => {
      if (i.paymentIntet?.paymentDate?.includes("January")) {
        January.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("February")) {
        February.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("March")) {
        March.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("April")) {
        April.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("May")) {
        May.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("June")) {
        June.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("July")) {
        July.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("August")) {
        August.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("September")) {
        September.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("October")) {
        October.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("November")) {
        November.push(i);
      } else if (i.paymentIntet?.paymentDate?.includes("December")) {
        December.push(i);
      }
    });

    var sum = 0;
    var max = 0;

    if (January.length > 0) {
      var JanuaryObj = {};
      JanuaryObj.total = January.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      JanuaryObj.totalRevenue = January.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      JanuaryObj.totalDiscount = January.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += JanuaryObj.total;
      JanuaryObj.totalsales = January.length;
      if (max <= JanuaryObj.total) {
        max = JanuaryObj.total;
      }
    } else {
      var JanuaryObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (February.length > 0) {
      var FebruaryObj = {};
      FebruaryObj.total = February.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      FebruaryObj.totalRevenue = February.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      FebruaryObj.totalDiscount = February.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += FebruaryObj.total;
      FebruaryObj.totalsales = February.length;
      if (max <= FebruaryObj.total) {
        max = FebruaryObj.total;
      }
    } else {
      var FebruaryObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (March.length > 0) {
      var MarchObj = {};
      MarchObj.total = March.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      MarchObj.totalRevenue = March.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      MarchObj.totalDiscount = March.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += MarchObj.total;
      MarchObj.totalsales = March.length;
      if (max <= MarchObj.total) {
        max = MarchObj.total;
      }
    } else {
      var MarchObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (April.length > 0) {
      var AprilObj = {};
      AprilObj.total = April.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      AprilObj.totalRevenue = April.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      AprilObj.totalDiscount = April.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += AprilObj.total;
      AprilObj.totalsales = April.length;
      if (max <= AprilObj.total) {
        max = AprilObj.total;
      }
    } else {
      var AprilObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (May.length > 0) {
      var MayObj = {};
      MayObj.total = May.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      MayObj.totalRevenue = May.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      MayObj.totalDiscount = May.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += MayObj.total;
      MayObj.totalsales = May.length;
      if (max <= MayObj.total) {
        max = MayObj.total;
      }
    } else {
      var MayObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (June.length > 0) {
      var JuneObj = {};
      JuneObj.total = June.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      JuneObj.totalRevenue = June.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      JuneObj.totalDiscount = June.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += JuneObj.total;
      JuneObj.totalsales = June.length;
      if (max <= JuneObj.total) {
        max = JuneObj.total;
      }
    } else {
      var JuneObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (July.length > 0) {
      var JulyObj = {};
      JulyObj.total = July.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      JulyObj.totalRevenue = July.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      JulyObj.totalDiscount = July.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += JulyObj.total;
      JulyObj.totalsales = July.length;
      if (max <= JulyObj.total) {
        max = JulyObj.total;
      }
    } else {
      var JulyObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (August.length > 0) {
      var AugustObj = {};
      AugustObj.total = August.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      AugustObj.totalRevenue = August.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      AugustObj.totalDiscount = August.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += AugustObj.total;
      AugustObj.totalsales = August.length;
      if (max <= AugustObj.total) {
        max = AugustObj.total;
      }
    } else {
      var AugustObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }

    if (September.length > 0) {
      var SeptemberObj = {};
      SeptemberObj.total = September.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      SeptemberObj.totalRevenue = September.map(
        (i) => i.bill.finalAmout
      ).reduce((prev, next) => prev + next);
      SeptemberObj.totalDiscount = September.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += SeptemberObj.total;
      SeptemberObj.totalsales = September.length;
      if (max <= SeptemberObj.total) {
        max = SeptemberObj.total;
      }
    } else {
      var SeptemberObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (October.length > 0) {
      var OctoberObj = {};
      OctoberObj.total = October.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      OctoberObj.totalRevenue = October.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      OctoberObj.totalDiscount = October.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += OctoberObj.total;
      OctoberObj.totalsales = October.length;
      if (max <= OctoberObj.total) {
        max = OctoberObj.total;
      }
    } else {
      var OctoberObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (November.length > 0) {
      var NovemberObj = {};
      NovemberObj.total = November.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      NovemberObj.totalRevenue = November.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      NovemberObj.totalDiscount = November.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += NovemberObj.total;
      NovemberObj.totalsales = November.length;
      if (max <= NovemberObj.total) {
        max = NovemberObj.total;
      }
    } else {
      var NovemberObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
    if (December.length > 0) {
      var DecemberObj = {};
      DecemberObj.total = December.map((i) => i.bill.totalprice).reduce(
        (prev, next) => prev + next
      );
      DecemberObj.totalRevenue = December.map((i) => i.bill.finalAmout).reduce(
        (prev, next) => prev + next
      );
      DecemberObj.totalDiscount = December.map((i) => i.bill.discount).reduce(
        (prev, next) => prev + next
      );
      sum += DecemberObj.total;
      DecemberObj.totalsales = December.length;
      if (max <= DecemberObj.total) {
        max = DecemberObj.total;
      }
    } else {
      var DecemberObj = {
        total: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalsales: 0,
      };
    }
  }

  res.json({
    max: max,
    sum: sum,
    January: JanuaryObj,
    February: FebruaryObj,
    March: MarchObj,
    April: AprilObj,
    May: MayObj,
    June: JuneObj,
    July: JulyObj,
    August: AugustObj,
    September: SeptemberObj,
    October: OctoberObj,
    November: NovemberObj,
    December: DecemberObj,
  });
});

module.exports.FETCH_ORDERS = AsynceHandler(async (req, res) => {
  const orderId = req.body.orderId;
  try {
    const order = await OrderModel.findOne(
      { _id: orderId },
      {
        sold: 0,
        quantity: 0,
        date_added: 0,
        __v: 0,
        ratings: 0,
        totolratings: 0,
      }
    ).populate("products.product");
    res.json(order);
  } catch (error) {
    throw new Error(error);
  }
});

///admin fetch order details///
module.exports.FETCH_ORDER_DETAILS = AsynceHandler(async (req, res) => {
  const orderId = req.body.orderId;
  try {
    const order = await OrderModel.findOne(
      { _id: orderId },
      {
        sold: 0,
        quantity: 0,
        date_added: 0,
        __v: 0,
        ratings: 0,
        totolratings: 0,
      }
    ).populate("products.product");
    res.json(order);
  } catch (error) {
    throw new Error(error);
  }
});

///update order///

module.exports.UPDATE_ORDER = AsynceHandler(async (req, res) => {
  const { orderId, orderStatus } = req.body;
  var currentDate = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        orderStatus: orderStatus,
        updateDate: currentDate,
      },
      {
        new: true,
      }
    ).populate("products.product");
    res.json(updatedOrder);
  } catch (error) {
    throw new Error(error);
  }
});

//delete order/////
module.exports.DELETE_ORDER = AsynceHandler(async (req, res) => {
  const { orderId } = req.body;

  try {
    await OrderModel.findByIdAndDelete(orderId);
  } catch (error) {
    throw new Error(error);
  }
});

//=========================================================================proucts controllers==================================================================================>

module.exports.FETCH_ONE_PRODUCT = AsynceHandler(async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .populate("wishlists")
      .populate("carts.user")
      .populate("orders.user");

    res.send(product);
  } catch {
    res.json("BAD REQUEST  ");
  }
});

///get the real value from user input text////
function scramble(string1, string2) {
  return string2?.split("").every(function (character) {
    return string1?.includes(character);
  });
  // return string1.includes(string2);
}

//fetch proudcts with filter and sorting//

module.exports.FETCH_PRODUCT = AsynceHandler(async (req, res) => {
  //only do when searching string is not empty//
  const lengthofSearch = req.body?.searchstring?.length;

  if (lengthofSearch > 0) {
    let seachtext1 = req.body.searchstring;

    const searchtext = seachtext1
      ?.replace(
        /and|And|or|Or|with|color|show|me|some|cool|[^a-zA-Z ]|[^\w\s]|(.)\1/g,
        ``
      )
      .split(" ");

    const words = searchtext?.filter((str) => str !== "");

    const properties = await PropertiesModel.find();

    if (properties?.length > 0 && words) {
      var brands = properties[0].brands;
      var categories = properties[0].categories;
      var colors = properties[0].colors;
      var frameTypes = properties[0].frameTypes;
      var sizes = properties[0].sizes;
      var shapes = properties[0].shapes;
      var genders = properties[0].genders;
      var category1 = [];
      var Brand1 = [];
      var color1 = [];
      var shape1 = [];
      var size1 = [];
      var gender1 = [];
      var frameType1 = [];
      for (let i = 0; i < words?.length; i++) {
        for (let j = 0; j < categories?.length; j++) {
          const regex = words[i].toLocaleLowerCase();

          if (scramble(categories[j]?.toLocaleLowerCase(), regex)) {
            category1.push({ category: categories[j] });
            break;
          }
        }
        for (let j = 0; j < brands?.length; j++) {
          const regex = words[i].toLocaleLowerCase();

          if (scramble(brands[j]?.toLocaleLowerCase(), regex)) {
            Brand1.push({ Brand: brands[j] });
            break;
          }
        }
        for (let j = 0; j < colors?.length; j++) {
          const regex = words[i].toLocaleLowerCase();

          if (scramble(colors[j]?.toLocaleLowerCase(), regex)) {
            color1.push({ color: colors[j] });
            break;
          }
        }
        for (let j = 0; j < frameTypes?.length; j++) {
          const regex = words[i].toLocaleLowerCase();

          if (scramble(frameTypes[j]?.toLocaleLowerCase(), regex)) {
            frameType1.push({ frameType: frameTypes[j] });
            break;
          }
        }
        for (let j = 0; j < sizes?.length; j++) {
          const regex = words[i].toLocaleLowerCase();

          if (scramble(sizes[j]?.toLocaleLowerCase(), regex)) {
            size1.push({ size: sizes[j] });
            break;
          }
        }
        for (let j = 0; j < shapes?.length; j++) {
          const regex = words[i].toLocaleLowerCase();

          if (scramble(shapes[j]?.toLocaleLowerCase(), regex)) {
            shape1.push({ shape: shapes[j] });
            break;
          }
        }
        for (let j = 0; j < genders?.length; j++) {
          const regex = words[i].toLocaleLowerCase();

          if (scramble(genders[j]?.toLocaleLowerCase(), regex)) {
            gender1.push({ gender: genders[j] });
            break;
          }
        }
      }
    }

    ///filtering///

    var queryArray = [];
    //frameType union//
    if (req.body?.frameType) {
      let frameTypeObj = {};

      const union = [...new Set([...req.body.frameType, ...frameType1])];
      if (union.length > 0) {
        frameTypeObj.$or = union;

        queryArray.push(frameTypeObj);
      }
    }

    //color union//
    if (req.body?.color) {
      let colorObj = {};
      const union = [...new Set([...req.body.color, ...color1])];

      if (union.length > 0) {
        colorObj.$or = union;
        queryArray.push(colorObj);
      }
    }

    // //shape union//
    if (req.body?.shape) {
      let shapeObj = {};
      const union = [...new Set([...req.body.shape, ...shape1])];

      if (union.length > 0) {
        shapeObj.$or = union;
        queryArray.push(shapeObj);
      }
    }

    // // //Brand union
    if (req.body?.Brand) {
      let BrandObj = {};
      const union = [...new Set([...req.body.Brand, ...Brand1])];

      if (union.length > 0) {
        BrandObj.$or = union;
        queryArray.push(BrandObj);
      }
    }

    // // //size union
    if (req.body?.size) {
      let sizeObj = {};
      const union = [...new Set([...req.body.size, ...size1])];

      if (union.length > 0) {
        sizeObj.$or = union;
        queryArray.push(sizeObj);
      }
    }

    // //sizeunion
    if (req.body?.category) {
      let categoryObj = {};

      const union = [...new Set([...req.body.category, ...category1])];

      if (union.length > 0) {
        categoryObj.$or = union;
        queryArray.push(categoryObj);
      }
    }

    // //gender union
    if (req.body?.gender) {
      let genderObj = {};
      const union = [...new Set([...req.body.gender, ...gender1])];

      if (union.length > 0) {
        genderObj.$or = union;
        queryArray.push(genderObj);
      }
    }
  } else {
    var queryArray = [];
    //frameType union//
    if (req.body?.frameType.length > 0) {
      let frameTypeObj = {};

      frameTypeObj.$or = req.body?.frameType;

      queryArray.push(frameTypeObj);
    }

    //color union//
    if (req.body?.color.length > 0) {
      let colorObj = {};

      colorObj.$or = req.body?.color;
      queryArray.push(colorObj);
    }

    // //shape union//
    if (req.body?.shape.length > 0) {
      let shapeObj = {};

      shapeObj.$or = req.body?.shape;
      queryArray.push(shapeObj);
    }

    // // //Brand union
    if (req.body?.Brand.length > 0) {
      let BrandObj = {};

      BrandObj.$or = req.body?.Brand;
      queryArray.push(BrandObj);
    }

    // // //size union
    if (req.body?.size.length > 0) {
      let sizeObj = {};

      sizeObj.$or = req.body?.size;
      queryArray.push(sizeObj);
    }

    // //sizeunion
    if (req.body?.category.length > 0) {
      let categoryObj = {};

      categoryObj.$or = req.body?.category;
      queryArray.push(categoryObj);
    }

    // //gender union
    if (req.body?.gender.length > 0) {
      let genderObj = {};

      genderObj.$or = req.body?.gender;
      queryArray.push(genderObj);
    }
  }

  //sorting
  if (req.body.sortby) {
    var sortbyObj = {};
    if (req.body.sortby === "R") {
      sortbyObj = { sold: 1, productId: 1 };
    }
    if (req.body.sortby === "HtL") {
      sortbyObj = { mPrice: -1, productId: 1 };
    }
    if (req.body.sortby === "LtH") {
      sortbyObj = { mPrice: 1, productId: 1 };
    }
    if (req.body.sortby === "CR") {
      sortbyObj = { totolratings: -1, productId: 1 };
    }
    if (req.body.sortby === "WN") {
      sortbyObj = { date_added: -1, productId: 1 };
    }
    if (req.body.sortby === "Wl") {
      sortbyObj = { wishlistcount: -1, productId: 1 };
    }
    if (req.body.sortby === "C") {
      sortbyObj = { cartcount: -1, productId: 1 };
    }
    if (req.body.sortby === "O") {
      sortbyObj = {
        ordercount: -1,
        productId: 1,
      };
    }
    if (req.body.sortby === "V") {
      sortbyObj = { views: -1, productId: 1 };
    }
    if (req.body.sortby === "ISLtH") {
      sortbyObj = { quantity: 1, productId: 1 };
    }
    if (req.body.sortby === "ISHtL") {
      sortbyObj = { quantity: -1, productId: 1 };
    }
  } else {
    sortbyObj = { sold: -1, productId: 1 };
  }
  const { current } = req.body;
  const limit = 18;
  const skip = limit * (current - 1);

  if (queryArray?.length > 0) {
    try {
      const totalproduct = await productModel.find({
        $and: queryArray,
      });

      let finalproducts = {};

      finalproducts.count = totalproduct?.length;
      finalproducts.limit = limit;

      finalproducts.products = await productModel
        .find({
          $and: queryArray,
        })
        .skip(skip)
        .limit(limit)
        .sort(sortbyObj);
      res.json(finalproducts);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    try {
      let finalproducts = {};
      finalproducts.limit = limit;
      finalproducts.count = await productModel.countDocuments();

      finalproducts.products = await productModel
        .find()
        .sort(sortbyObj)
        .limit(limit)
        .skip(skip);
      res.json(finalproducts);
    } catch (error) {
      throw new Error(error);
    }
  }
});

//add product///
module.exports.AVAIABLE_ID = AsynceHandler(async (req, res) => {
  try {
    const product = await productModel.findOne(req.body);
    if (product) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch {
    res.json("BAD REQUEST");
  }
});

module.exports.ADD_PRODUCT = AsynceHandler(async (req, res) => {
  try {
    await productModel
      .create(req.body)
      .then((products) => res.json(products))
      .catch((err) => res.json(err));
  } catch {
    res.json("BAD REQUEST");
  }
});
module.exports.FETCH_PRODUCT_BY_PROPERTIES = AsynceHandler(async (req, res) => {
  try {
    finalproducts = await productModel
      .find(req.body)
      .skip(skip)
      .limit(limit)
      .sort(sortbyObj);
    res.json(finalproducts);
  } catch (error) {
    throw new Error(error);
  }
});

//add product///
module.exports.ADD_PRODUCT = AsynceHandler(async (req, res) => {
  try {
    await productModel
      .create(req.body)
      .then((products) => res.json(products))
      .catch((err) => res.json(err));
  } catch {
    res.json("BAD REQUEST");
  }
});

///DELETE_PRODUCT///
module.exports.DELETE_PRODUCT = AsynceHandler(async (req, res) => {
  try {
    const deletedproduct = await productModel.findByIdAndDelete(req?.body?._id);
    res.json(deletedproduct);
  } catch (error) {
    throw new Error(error);
  }
});

//UPADTE.PRODUCT////

module.exports.REMOVE_IMAGE_FROM_PRODUCT = AsynceHandler(async (req, res) => {
  const _id = req.body._id;
  const id = req.body.id;
  try {
    const deleted = await cloudinaryDeleteImg(id, "images");
    if (deleted.result === "ok") {
      const updatedproduct = await productModel.findByIdAndUpdate(
        _id,
        {
          $pull: { images: { public_id: id } },
        },
        {
          new: true,
        }
      );
      if (updatedproduct) {
        res.json(updatedproduct);
      }
    } else {
      res.json("imagenotfouud");
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.REMOVE_THUMNAIL_FROM_PRODUCT = AsynceHandler(
  async (req, res) => {
    const _id = req.body._id;
    const id = req.body.id;
    try {
      const deleted = await cloudinaryDeleteImg(id, "images");

      if (deleted.result === "ok") {
        const updatedproduct = await productModel.findByIdAndUpdate(
          _id,
          {
            $pull: { thumnailimages: { public_id: id } },
          },
          {
            new: true,
          }
        );
        if (updatedproduct) {
          res.json(updatedproduct);
        }
      } else {
        res.json("imagenotfouud");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
);
module.exports.UPDATE_PRODUCT = AsynceHandler(async (req, res) => {
  try {
    const updatedproduct = await productModel.findByIdAndUpdate(
      req?.body?._id,
      {
        Brand: req?.body?.Brand,
        mPrice: req?.body?.mPrice,
        thumnailimages: req?.body?.thumnailimages,
        images: req?.body?.images,
        quantity: req?.body?.quantity,
        color: req?.body?.color,
        frameType: req?.body?.frameType,
        shape: req?.body?.shape,
        gender: req?.body?.gender,
        category: req?.body?.category,
        quantity: req?.body?.quantity,
      },
      {
        new: true,
      }
    );
    res.send(updatedproduct);
  } catch {
    res.json("BAD REQUEST");
  }
});

///add new field in all at once
//need to update schema first//

// module.exports.CHANGE_FIELD_IN_ALL = AsynceHandler(async (req, res) => {
//   try {
//     const updatedproduct = await productModel.updateMany(
//       {},
//       { $rename: { CompanyName: "Brand" } }

//     );
//     res.json(updatedproduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
module.exports.CONVERT_FIELD_VALUE_LOWERCASE = AsynceHandler(
  async (req, res) => {
    try {
      const updatedproduct = await productModel.updateMany(
        { gender: "Female" },
        {
          gender: "female",
        }
      );

      res.json(updatedproduct);
    } catch (error) {
      throw new Error(error);
    }
  }
);
module.exports.CHANGE_ONE_FIELD_VALUE = AsynceHandler(async (req, res) => {
  try {
    const updatedproduct = await PropertiesModel.updateMany(
      {
        category: "computer glasses",
      },
      [
        {
          $set: {
            category: "computerglasses",
            // Brands: { $toLower: "$Brands" },
            // shpaes: { $toLower: "$shpaes" },
            // sizes: { $toLower: "$sizes" },
            // frameTypes: { $toLower: "$frameTypes" },
            // colors: { $toLower: "$colors" },
          },
        },
      ]
    );

    res.json(updatedproduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.CONVERTING_FIELD_TYPE = AsynceHandler(async (req, res) => {
  try {
    const updatedproduct = await productModel.updateMany(
      {
        color: {
          $type: "string",
        },
      },
      [
        {
          $set: { color: ["$color"] },
        },
      ],
      {
        multi: true,
      }
    );
    res.json(updatedproduct);
  } catch (error) {
    throw new Error(error);
  }
});

//all field in all
module.exports.ADD_FIELD_IN_ALL = AsynceHandler(async (req, res) => {
  try {
    await productModel.updateMany(
      {},
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    const products = await productModel.find();
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

//remove field from document
//need to update schema first//

module.exports.REMOVE_FIELD_IN_ALL = AsynceHandler(async (req, res) => {
  try {
    const products = await productModel.updateMany(
      {},
      {
        $unset: req.body,
      },
      {
        new: true,
      }
    );
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

//=============================ADMIN COUPON CONTROLLS==========>
module.exports.CREATE_COUPON = AsynceHandler(async (req, res) => {
  try {
    const newCoupon = await couponModel.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

//fetch all coupons
module.exports.FETCH_COUPONS = AsynceHandler(async (req, res) => {
  try {
    const coupon = await couponModel.find();
    res.json(coupon);
  } catch (error) {
    res.json("BAD_REQUREST");
  }
});

//delete coupon/
module.exports.DELETE_COUPON = AsynceHandler(async (req, res) => {
  try {
    const coupon = await couponModel.findByIdAndDelete(req.body._id);
    res.json(coupon);
  } catch (error) {
    res.json("BAD REQUEST");
  }
});

///=======================================================================properties controllers///

module.exports.FETCH_PROPERTIES_DETAILS = AsynceHandler(async (req, res) => {
  try {
    const products = await productModel.find();
    // res.json(products);
    if (products) {
      var frameType = [];
      var color = [];
      var size = [];
      var shape = [];
      var category = [];
      var gender = [];
      var Brand = [];

      products?.map((i) => {
        frameType.push(i.frameType);
        Brand.push(i.Brand);

        i.color.map((index) => {
          color.push(index);
        });
        size.push(i.size);
        shape.push(i.shape);
        category.push(i.category);
        gender.push(i.gender);
      });

      const frameTypecount = {};

      const colorcount = {};
      const sizecount = {};
      const shapecount = {};
      const categorycount = {};
      const gendercount = {};
      const Brandcount = {};
      Brand.forEach((element) => {
        Brandcount[element] = (Brandcount[element] || 0) + 1;
      });
      frameType.forEach((element) => {
        frameTypecount[element] = (frameTypecount[element] || 0) + 1;
      });
      color.forEach((element) => {
        colorcount[element] = (colorcount[element] || 0) + 1;
      });
      size.forEach((element) => {
        sizecount[element] = (sizecount[element] || 0) + 1;
      });
      shape.forEach((element) => {
        shapecount[element] = (shapecount[element] || 0) + 1;
      });
      category.forEach((element) => {
        categorycount[element] = (categorycount[element] || 0) + 1;
      });
      gender.forEach((element) => {
        gendercount[element] = (gendercount[element] || 0) + 1;
      });

      res.json({
        Brandcount,
        frameTypecount,
        colorcount,
        sizecount,
        shapecount,
        categorycount,
        gendercount,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.FETCH_PROPERTIES = AsynceHandler(async (req, res) => {
  try {
    const Properties = await PropertiesModel.find();
    res.json(Properties);
  } catch (error) {
    throw new Error(error);
  }
});

//create properties
module.exports.CREATE_PROPERTIES = AsynceHandler(async (req, res) => {
  try {
    const properties = await PropertiesModel.create({
      brands: req.body?.brand,
    });
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

//add properties///
module.exports.ADD_PROPERTIES = AsynceHandler(async (req, res) => {
  try {
    const updateproproties = await PropertiesModel.updateMany(
      {},
      {
        $addToSet: {
          brands: req?.body?.brand?.toLowerCase(),

          categories: req?.body?.category?.toLowerCase(),
          sizes: req?.body?.size?.toLowerCase(),
          shapes: req?.body?.shape?.toLowerCase(),
          colors: req?.body?.color?.toLowerCase(),
          frameTypes: req?.body?.frameType?.toLowerCase(),
        },
      }
    );
    const properties = await PropertiesModel.find();

    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

//delete property
module.exports.DELETE_PROPERTIES = AsynceHandler(async (req, res) => {
  try {
    const products = await productModel.updateMany(req.body, {
      $set: {
        quantity: 0,
      },
    });
    const properties = await PropertiesModel.find();

    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

//////////image upload to googel drive///

module.exports.ADD_IMAGE = AsynceHandler(async (req, res) => {
  const files = req.files;

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    let urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      // fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

// delete image

module.exports.DELETE_IMAGE = AsynceHandler(async (req, res) => {
  const id = req.body.id;

  try {
    const deleted = await cloudinaryDeleteImg(id, "images");
    if (deleted.result === "ok") {
      res.json(id);
    } else {
      res.json("failed");
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.ADD_IMAGE_TO_PRODUCT = AsynceHandler(async (req, res) => {
  const files = req.files;
  const _id = req.body._id;
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    let urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
    }
    const images = urls.map((file) => {
      return file;
    });

    if (images?.length > 0) {
      var product = await productModel.findByIdAndUpdate(
        _id,
        {
          images: images,
        },
        { new: true }
      );
    }
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.ADD_THUMNAIL_TO_PRODUCT = AsynceHandler(async (req, res) => {
  const files = req.files;
  const _id = req.body._id;
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    let urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      // fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });

    if (images?.length > 0) {
      var product = await productModel.findByIdAndUpdate(
        _id,
        {
          thumnailimages: images,
        },
        { new: true }
      );
    }
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.DELETE_FIELD = AsynceHandler(async (req, res) => {
  const fieldname = req.body.fieldname;
  console.log("fieldname",fieldname);
  try {
    const product = await productModel.updateMany(
      {},
      { $unset: { 
        totolratings: 1 } },
      { multi: true }
    );
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});
