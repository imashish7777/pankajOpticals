const AsynceHandler = require("express-async-handler");
const OrderModel = require("../Models/Order.model");
const userModal = require("../Models/User.model");
const { validateMongoDbId } = require("../utils/validateMongodbid");
var uniqid = require("uniqid");
const cartModel = require("../Models/Cart.model");
const ProductModel = require("../Models/Product.model");

//Admin route==============================================================================================>

//ORDER_ROUTEES==========================================================================================>
module.exports.FETCH_ORDERS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    let response = await userModal
      .findById(_id)
      .select("order")
      .populate({
        path: "order",
        options: {
          sort: { createdAt: -1, _id: -1 },
        },
        populate: {
          path: "products.product",
          model: "products",
        },
      });

    res.send(response);
  } catch {
    (err) => {
      res.status(500);
    };
  }
});

module.exports.FETCH_ORDER_DETAILS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

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

/////place order///
//300-500ms//
module.exports.PLACE_ORDER = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { method, shippingAddressId, orderId } = req.body;
  var currentDate = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    if (shippingAddressId || orderId) {
      let user = await userModal.findById(_id).select("addresses order");
      var findIndex = user.addresses.findIndex(
        (i) => i._id == shippingAddressId
      );
      var shippingAddress = user.addresses[findIndex];

      if (method !== undefined) {
        var finalorder = await OrderModel.findOneAndUpdate(
          { _id: orderId },
          {
            paymentIntet: {
              method: method,

              id: uniqid(),
              paymentDate: currentDate,
              currency: "Rupees",
              paymentStatus: "success",
            },
            orderStatus: "ordered",
          },
          {
            new: true,
          }
        );
        res.json(finalorder);
        if (finalorder) {
          Promise.all(
            finalorder.products.map((i) =>
              ProductModel.findByIdAndUpdate(
                { _id: i.product },
                {
                  $push: {
                    orders: { user: _id, count: i.quantity },
                  },
                  $inc: { ordercount: i.quantity },
                }
              )
            )
          ).catch(console.error);
        }
      } else {
        var methodpending = await OrderModel.findOneAndUpdate(
          { _id: orderId },
          {
            shippingAddress: shippingAddress,
          },
          {
            new: true,
          }
        ).populate("products.product");
        res.json(methodpending);
      }
    } else {
      // if(orderId){
      //   let order=await OrderModel.findById(orderId);

      // }
      let usercart = await cartModel.findOne({ orderby: _id });
      //check if coupon is applied///
      if (usercart.totalAfterDiscount) {
        var discount = usercart.cartTotal - usercart.totalAfterDiscount;
        var finalAmout = usercart.totalAfterDiscount;
      }

      //making the order bill///
      let bill = {
        totalprice: usercart?.cartTotal,
        discount: discount || 0,
        finalAmout: finalAmout || usercart?.cartTotal,
      };
      var newOrder = await OrderModel.create({
        products: usercart.products,

        orderStatus: "payment pending",
        orderDate: currentDate,
        shippingAddress: "Address Required",
        orderby: _id,

        bill: bill,
      });

      await userModal.findByIdAndUpdate(_id, {
        $push: { order: newOrder._id },
      });
      res.json(newOrder);
    }
  } catch (error) {
    throw new Error(error);
  }
});

///cancel the order///

module.exports.CANCEL_ORDER = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { orderId } = req.body;
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
        orderStatus: "Cancelled",
        updatedDate: currentDate,
      },
      {
        new: true,
      }
    );
    res.json(updatedOrder);
  } catch (error) {
    throw new Error(error);
  }
});

///return order
module.exports.RETURN_ORDER = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { orderId } = req.body;
  var currentDate = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    const returnorder = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        orderStatus: "return",
        updatedDate: currentDate,
      },
      {
        new: true,
      }
    ).populate("products.product");
    res.json(returnorder);
  } catch (error) {
    throw new Error(error);
  }
});
