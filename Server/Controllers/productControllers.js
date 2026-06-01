// const express= require("express");
const productModel = require("../Models/Product.model");
const AsynceHandler = require("express-async-handler");
const userModel = require("../Models/User.model");
const cartModel = require("../Models/Cart.model");
const { validateMongoDbId } = require("../utils/validateMongodbid");
const couponModel = require("../Models/Coupon.model");
const PropertiesModel = require("../Models/Properties.model");

//ADMIN ROUTE=============================================================================================================>

/////PRODUCT FETCH//===============================================================================================>
//150-200ms//
// const productModel = require("../Models/Product.model");
// const PropertiesModel = require("../Models/Properties.model");
// const AsynceHandler = require("express-async-handler");

// ================= SCRAMBLE =================
function scramble(string1 = "", string2 = "") {
  return string2
    .split("")
    .every((character) => string1.includes(character));
}

function applyCouponDiscount(cart) {
  if (!cart.CouponApplied) return;

  cart.totalAfterDiscount =
    cart.cartTotal -
    (cart.cartTotal * cart.CouponApplied.discount) / 100;

  if (cart.cartTotal - cart.totalAfterDiscount > cart.CouponApplied.upTo) {
    cart.totalAfterDiscount = cart.cartTotal - cart.CouponApplied.upTo;
  }
}

// ================= FETCH PRODUCT =================
module.exports.FETCH_PRODUCT = AsynceHandler(async (req, res) => {
  try {
    const {
      searchstring = "",
      frameType = [],
      color = [],
      shape = [],
      Brand = [],
      size = [],
      category = [],
      gender = [],
      sortby,
      current = 1,
    } = req.body;
    console.log("Received fetch products request with body:", req.body);

    const limit = 20;
    const skip = (Number(current) - 1) * limit;

    let queryArray = [];

    // ================= SEARCH =================
    const trimmedSearch = searchstring.trim();
    console.log("Trimmed search string:", trimmedSearch);

    if (trimmedSearch.length > 0) {
      const cleanWords = trimmedSearch
        .replace(
          /and|And|or|Or|with|color|show|me|some|cool|[^a-zA-Z ]|[^\w\s]|(.)\1/g,
          "",
        )
        .split(" ")
        .filter(Boolean)
        .map((word) => word.toLowerCase());
        console.log("Cleaned search words:", cleanWords);

      const properties = await PropertiesModel.findOne().lean();

      if (properties && cleanWords.length > 0) {
        const propertyMap = {
          category: properties.categories || [],
          Brand: properties.brands || [],
          color: properties.colors || [],
          shape: properties.shapes || [],
          size: properties.sizes || [],
          gender: properties.genders || [],
          frameType: properties.frameTypes || [],
        };

        const matchedFilters = {
          category: [],
          Brand: [],
          color: [],
          shape: [],
          size: [],
          gender: [],
          frameType: [],
        };

        // ================= FIND MATCHES =================
        for (const word of cleanWords) {
          for (const key in propertyMap) {
            const values = propertyMap[key];

            for (let i = 0; i < values.length; i++) {
              const value = values[i];

              if (
                value &&
                scramble(value.toLowerCase(), word)
              ) {
                matchedFilters[key].push({
                  [key]: value,
                });

                break;
              }
            }
          }
        }

        // ================= MERGE FILTERS =================
        const mergedFilters = {
          frameType: [...frameType, ...matchedFilters.frameType],
          color: [...color, ...matchedFilters.color],
          shape: [...shape, ...matchedFilters.shape],
          Brand: [...Brand, ...matchedFilters.Brand],
          size: [...size, ...matchedFilters.size],
          category: [...category, ...matchedFilters.category],
          gender: [...gender, ...matchedFilters.gender],
        };

        for (const key in mergedFilters) {
          const values = mergedFilters[key];

          if (values.length > 0) {
            // remove duplicate objects
            const unique = [
              ...new Map(
                values.map((item) => [
                  JSON.stringify(item),
                  item,
                ]),
              ).values(),
            ];

            queryArray.push({
              $or: unique,
            });
          }
        }
      }
    } else {
      // ================= NORMAL FILTERS =================

      if (frameType.length)
        queryArray.push({ $or: frameType });

      if (color.length)
        queryArray.push({ $or: color });

      if (shape.length)
        queryArray.push({ $or: shape });

      if (Brand.length)
        queryArray.push({ $or: Brand });

      if (size.length)
        queryArray.push({ $or: size });

      if (category.length)
        queryArray.push({ $or: category });

      if (gender.length)
        queryArray.push({ $or: gender });
    }

    // ================= SORTING =================

    let sortbyObj = {
      sold: -1,
      productId: 1,
    };

    switch (sortby) {
      case "R":
        sortbyObj = {
          sold: 1,
          productId: 1,
        };
        break;

      case "HtL":
        sortbyObj = {
          mPrice: -1,
          productId: 1,
        };
        break;

      case "LtH":
        sortbyObj = {
          mPrice: 1,
          productId: 1,
        };
        break;

      case "CR":
        sortbyObj = {
          totolratings: -1,
          productId: 1,
        };
        break;

      case "WN":
        sortbyObj = {
          date_added: -1,
          productId: 1,
        };
        break;
    }

    // ================= FINAL QUERY =================

    const query =
      queryArray.length > 0
        ? { $and: queryArray }
        : {};

    // ================= FETCH =================

    const [count, products] = await Promise.all([
      productModel.countDocuments(query),

      productModel
        .find(query)
        .sort(sortbyObj)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    // ================= RESPONSE =================

    res.json({
      count,
      limit,
      products,
    });
  } catch (error) {
    throw new Error(error);
  }
});


//FETCH_HOME_PRODUCT

module.exports.FETCH_HOME_PRODUCT = AsynceHandler(async (req, res) => {
  try {
    const { category, gender } = req.params;

    const limit = category === "Eyeglasses" ? 10 : 12;

    const products = await productModel
      .find({
        category,
        gender,
      })
      .limit(limit)
      .lean();

    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

///FETCH_ONE_PRODUCT///
module.exports.FETCH_ONE_PRODUCT = AsynceHandler(async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          views: 1,
        },
      },

      {
        sold: 0,
        quantity: 0,
        date_added: 0,
        __v: 0,
      },
      {
        new: true,
      },
    );

    res.send(product);
  } catch {
    res.json("BAD REQUEST  ");
  }
});

module.exports.FETCH_SIMILAR_PRODUCTS = AsynceHandler(async (req, res) => {
  try {
    const similarProudct = await productModel.find(req.body);
    res.json(similarProudct);
  } catch (error) {
    throw new Error(error);
  }
});

///////GIVE RATINGS////

module.exports.FETCH_RATINGS = AsynceHandler(async (req, res) => {
  try {
    const ratings = await productModel
      .findById(req.params.id, {
        ratings: 1,
      })
      .lean()
      .populate("ratings.postedby", {
        firstname: 1,
        lastname: 1,
      });
    res.send(ratings);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.GIVE_RATINGS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { rating, productId, comment } = req.body;
  try {
    const product = await productModel.findById(productId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString(),
    );
    if (alreadyRated) {
      const updateRating = await productModel.updateOne(
        { ratings: { $elemMatch: { postedby: _id } } },
        { $set: { "ratings.$.star": rating, "ratings.$.comment": comment } },
        { new: true },
      );
      const finalratings = await productModel
        .findById(productId, { ratings: 1 })
        .lean()
        .populate("ratings.postedby", { firstname: 1, lastname: 2 });
      res.send(finalratings);
    } else {
      const totalratings = (
        (product.totolratings * product.ratings.length + Number(rating)) /
        (product.ratings.length + 1)
      ).toFixed(1);
      const rateProduct = await productModel.findByIdAndUpdate(
        productId,
        {
          $push: { ratings: { star: rating, comment: comment, postedby: _id } },
          $set: { totolratings: totalratings },
        },
        { new: true },
      );
      const finalratings = await productModel
        .findById(productId, { ratings: 1, totolratings: 1 })
        .lean()
        .populate("ratings.postedby", { firstname: 1, lastname: 2 });
      res.send(finalratings);
    }
  } catch (error) {
    throw new Error(error);
  }
});
//========================================================================================WISHLIST/===========================================================================>

///////FETCH_WISHLIST///
module.exports.FETCH_WISHLIST = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await userModel
      .findById(_id)
      .select("wishlist")
      .populate("wishlist", {
        date_added: 0,
        __v: 0,
        sold: 0,
        quantity: 0,
        rating: 0,
        category: 0,
      });
    res.send(user.wishlist);
  } catch (error) {
    res.sendStatus(500);
  }
});

/////ADD_TO_WISLIST///
module.exports.ADD_TO_WISHLIST = AsynceHandler(async (req, res) => {
  const _id = req.user._id;

  validateMongoDbId(_id);
  const { productId } = req.body;
  try {
    let user = await userModel
      .findByIdAndUpdate(
        _id,
        {
          $addToSet: { wishlist: productId },
          // usig addToSet to avoid duplicate entries in wishlist instead of $push to push the elements into the array without checking for duplicates
        },
        { new: true },
      )
      .populate("wishlist", {
        date_added: 0,
        __v: 0,
        sold: 0,
        quantity: 0,
        rating: 0,
        category: 0,
      });

    await user.save();
    res.json(user.wishlist);
    await productModel.findByIdAndUpdate(
      { _id: productId },
      {
        $addToSet: { wishlists: _id },
      },
    );
  } catch (error) {
    throw new Error(error);
  }
});

/////REMOVE_FROM_WISHLIST///
module.exports.REMOVE_FROM_WISHLIST = AsynceHandler(async (req, res) => {
  const _id = req.user._id;
  validateMongoDbId(_id);
  const { productId } = req.body;
  try {
    let user = await userModel
      .findByIdAndUpdate(_id, { $pull: { wishlist: productId } }, { new: true })
      .populate("wishlist", {
        date_added: 0,
        __v: 0,
        sold: 0,
        quantity: 0,
        rating: 0,
        category: 0,
      });
    await user.save();
    res.json(user.wishlist);
    await productModel.findByIdAndUpdate(
      { _id: productId },
      {
        $pull: { wishlists: _id },
        $inc: { wishlistcount: -1 },
      },
    );
  } catch (error) {
    throw new Error(error);
  }
});

///===================================================================================CART_ROUTE========================================================================================>
//////FETCH_CART////
//150-250ms//
module.exports.FETCH_CART = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await cartModel
      .findOne({ orderby: _id })
      .populate("products.product");

    if (cart) {
      res.json(cart);
    } else {
      res.json({});
    }
  } catch {
    res.sendStatus(500);
  }
});

///ADD_TO_CART///
//150-250ms//
module.exports.ADD_TO_CART = AsynceHandler(async (req, res) => {
  const { productId, mPrice } = req.body;
  const _id = req.user._id;
  validateMongoDbId(_id);

  try {
    const Cart = await cartModel
      .findOne({ orderby: _id }, { orderby: 0, __v: 0 })
      .populate("products.product", {
        date_added: 0,
        __v: 0,
        sold: 0,
        quantity: 0,
        rating: 0,
        category: 0,
      });

    if (Cart) {
      let itemIndex = Cart.products.findIndex(
        (p) => p.product._id == productId,
      );

      // Check if product exists or not
      if (itemIndex > -1) {
        var productItem = Cart.products[itemIndex];
        productItem.quantity = productItem.quantity + 1;
        Cart.products[itemIndex] = productItem;
        Cart.cartTotal += mPrice;

        applyCouponDiscount(Cart);
        await productModel.findByIdAndUpdate(
          productId,
          {
            $inc: { "carts.$[i].count": 1, cartcount: 1 },
          },
          {
            arrayFilters: [
              {
                "i.user": _id,
              },
            ],
          },
        );
      } else {
        res.send({});
        Cart.products.push({ product: productId, quantity: 1 });

        Cart.cartTotal += mPrice;
        applyCouponDiscount(Cart);
        if (Cart.CouponApplied) {
          Cart.Total = Cart.totalAfterDiscount;
        }
        await productModel.findByIdAndUpdate(
          { _id: productId },
          {
            $push: { carts: { user: _id, count: 1 } },
          },
        );
      }
      await Cart.save();
    } else {
      res.send({});

      const cart = await cartModel.create({
        products: [{ product: productId, quantity: 1 }],
        cartTotal: mPrice,
        orderby: _id,
      });

      const user = await userModel.findById(_id);
      user.cart = cart._id;
      await user.save();
      await productModel.findByIdAndUpdate(
        { _id: productId },
        {
          $inc: { cartcount: 1 },
          $push: { carts: { user: _id, count: 1 } },
        },
      );
    }
  } catch {
    res.json("BAD REQUEST");
  }
});

//EMPTY_CART////
module.exports.EMPTY_CART = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    res.json({});

    const user = await userModel.findByIdAndUpdate(_id, {
      $unset: { cart: 1 },
    });
    const cart1 = await cartModel.findOne({ orderby: _id });
    if (cart1) {
      await Promise.all(
        cart1.products.map((i) =>
          productModel.findByIdAndUpdate(i.product, {
            $pull: {
              carts: { user: _id },
            },
            $inc: {
              cartcount: -i.quantity,
            },
          })
        )
      );
    }

    await cartModel.findOneAndDelete({ orderby: _id });
  } catch (error) {
    throw new Error(error);
  }
});

///REMOVE_FROM_CART///
//150-250ms//
module.exports.REMOVE_FROM_CART = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { mPrice, productId } = req.body;

  try {
    let cart = await cartModel
      .findOne({ orderby: _id })
      .populate("products.product", {
        date_added: 0,
        __v: 0,
        sold: 0,
        quantity: 0,
        ratings: 0,
        category: 0,
      });
    let itemIndex = cart.products.findIndex((p) => p.product._id == productId);
    if (itemIndex > -1) {
      let productItem = cart.products[itemIndex];
      cart.cartTotal -= productItem.quantity * mPrice;
      var sum = productItem.quantity;
      cart.products[itemIndex] = productItem;

      cart.products.splice(itemIndex, 1);
      applyCouponDiscount(cart);
      if (cart.cartTotal === 0) {
        res.json({});
        await userModel.findByIdAndUpdate(_id, {
          $unset: { cart: 1 },
        });
        await cartModel.findOneAndDelete({ orderby: _id });
      } else {
        cart = await cart.save();
        res.json(cart);
      }
      await productModel.findByIdAndUpdate(
        { _id: productId },
        {
          $pull: { carts: { user: _id } },

          $inc: { cartcount: -sum },
        },
      );
    }
  } catch (err) {
    throw new Error(err);
  }
};

////DECREMENT_CART_PRODUCT_QUANTITY
//150-250ms//
module.exports.DECREMENT = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const quantity = 1;

  const { mPrice, productId } = req.body;

  try {
    let cart = await cartModel
      .findOne({ orderby: _id })
      .populate("products.product", {
        date_added: 0,
        __v: 0,
        sold: 0,
        quantity: 0,
        ratings: 0,
        category: 0,
      });
    let itemIndex = cart.products.findIndex((p) => p.product._id == productId);

    let productItem = cart.products[itemIndex];
    productItem.quantity -= quantity;
    cart.cartTotal -= mPrice;
    cart.products[itemIndex] = productItem;
    if (cart.CouponApplied) {
      applyCouponDiscount(cart);
      cart.totalAfterDiscount = cart.totalAfterDiscount | 0;
    }

    cart = await cart.save();
    res.send(cart);

    await productModel.findByIdAndUpdate(
      productId,
      {
        $inc: { "carts.$[i].count": -1, cartcount: -1 },
      },
      {
        arrayFilters: [
          {
            "i.user": _id,
          },
        ],
      },
    );
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

///increment///
module.exports.INCREMENT = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const quantity = 1;

  const { mPrice, productId } = req.body;

  try {
    let cart = await cartModel
      .findOne({ orderby: _id })
      .populate("products.product");
    let itemIndex = cart.products.findIndex((p) => p.product._id == productId);
    let productItem = cart.products[itemIndex];
    productItem.quantity += quantity;
    cart.cartTotal += mPrice;
    cart.products[itemIndex] = productItem;
    if (cart.CouponApplied) {
      applyCouponDiscount(cart);
      cart.totalAfterDiscount = cart.totalAfterDiscount | 0;
    }

    cart = await cart.save();
    res.send(cart);

    await productModel.findByIdAndUpdate(
      productId,
      {
        $inc: { "carts.$[i].count": 1, cartcount: 1 },
      },
      {
        arrayFilters: [
          {
            "i.user": _id,
          },
        ],
      },
    );
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

///APPLY_COUPON///
//400-600ms//
module.exports.APPLY_COUPON = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { coupon } = req.body;

  const validCoupon = await couponModel.findOne({ name: coupon });
  if (validCoupon === null) {
    // throw new Error("invalid Coupon");
    res.json("COUPON EXPIRED");
  } else {
    const user = await userModel.findOne({ _id });
    let { cartTotal } = await cartModel
      .findOne({
        orderby: _id,
      })
      .populate("products.product");
    let discount = ((cartTotal * validCoupon.discount) / 100)|0;
    if (discount > validCoupon.upTo) {
      discount = (validCoupon.upTo);
    }
    let totalAfterDiscount = (cartTotal - discount) | 0;


    const cart = await cartModel
      .findOneAndUpdate(
        { orderby: user._id },
        {
          totalAfterDiscount: totalAfterDiscount,
          CouponApplied: validCoupon,
        },
        { new: true },
      )
      .populate("products.product");

    res.json(cart);
  }
});

///REMOVE_COUPON///
//200-300ms//
module.exports.REMOVE_COUPON = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    var cart = await cartModel
      .findOneAndUpdate(
        { orderby: _id },
        {
          $unset: { totalAfterDiscount: 1, CouponApplied: 1 },
        },
        { new: true },
      )
      .populate("products.product");
    await cart.save();
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});
