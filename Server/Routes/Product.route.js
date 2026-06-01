const express = require("express");
const ProductRouter = express.Router();
const productController = require("../Controllers/productControllers");
const { authMiddleware } = require("../MIddleware/authMiddleware");
const{isblocked}=require("../MIddleware/authMiddleware")



//Home product
ProductRouter.get("/fetchhomeproducts/:category/:gender",productController.FETCH_HOME_PRODUCT);
ProductRouter.post("/fetchsimilarproudct",productController.FETCH_SIMILAR_PRODUCTS);

///product routes
ProductRouter.post("/fetchproducts", productController.FETCH_PRODUCT);
ProductRouter.get("/fetchratings/:id",productController.FETCH_RATINGS);
ProductRouter.put(
  "/giveratings",
  authMiddleware,
  isblocked,
  productController.GIVE_RATINGS
);
ProductRouter.get(
  "/details/:id",
  productController.FETCH_ONE_PRODUCT
);



/////wishlist routes

ProductRouter.get(
  "/fetchwishlist",
  authMiddleware,
  productController.FETCH_WISHLIST
);

ProductRouter.put(
  "/addtowishlist",
  authMiddleware,
  isblocked,
  productController.ADD_TO_WISHLIST
);
ProductRouter.put(
  "/removefromwishlist",
  authMiddleware,
  isblocked,
  productController.REMOVE_FROM_WISHLIST
);

////cart routes
ProductRouter.get("/fetchcart", authMiddleware, productController.FETCH_CART);
ProductRouter.post("/addtocart", authMiddleware,  isblocked, productController.ADD_TO_CART);

ProductRouter.delete(
  "/emptycart",
  authMiddleware,
  isblocked,
  productController.EMPTY_CART
);
ProductRouter.post(
  "/removefromcart",
  authMiddleware,
  isblocked,
  productController.REMOVE_FROM_CART
);
ProductRouter.post("/decrement", authMiddleware, isblocked, productController.DECREMENT);
ProductRouter.post("/increment", authMiddleware, isblocked, productController.INCREMENT);


ProductRouter.post(
  "/applycoupon",
  authMiddleware,
  isblocked,
  productController.APPLY_COUPON
);
ProductRouter.put(
  "/removecoupon",
  authMiddleware,
  isblocked,
  productController.REMOVE_COUPON
);

module.exports = ProductRouter;
