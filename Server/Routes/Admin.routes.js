const express = require("express");
const adminControllers = require("../Controllers/adminControllers");
const AdminRouter = express.Router();
const { isAdmin, authMiddleware } = require("../MIddleware/authMiddleware");
AdminRouter.use(express.json());
const {
  uploadPhoto,
  productImgResize,
} = require("../MIddleware/uploadMIddleware");
const {
  uploadPhoto1,
  productImgResize1,
} = require("../MIddleware/updateMidderware");
//=====================================================================ADMIN authrization routes==========================================================>

AdminRouter.get("/isAuthicated", adminControllers.ISAUTHICATED);
AdminRouter.post("/login", adminControllers.LOGIN);
AdminRouter.post("/logout", adminControllers.LOGOUT);
AdminRouter.get("/refreshtoken", adminControllers.REFRESH_TOKEN);
// AdminRouter.put("/updateemail",authMiddleware,authController.UPDATE_EMAIL);// don't done yet
AdminRouter.put(
  "/updateaccount",
  authMiddleware,
  isAdmin,
  adminControllers.UPDATE_ACCOUNT
);

AdminRouter.put(
  "/updatepassword",
  authMiddleware,
  isAdmin,

  adminControllers.UPDATE_PASSWORD
);
AdminRouter.post(
  "/forgotpasswordtoken",
  adminControllers.FORGOT_PASSWORD_TOKEN
);
AdminRouter.put("/resetpassword/:token", adminControllers.RESET_PASSWORD);

//=========================================================================CUSTOMER ROUTES=====================================================================>

///FETCH ALL CUSTOMERS///
AdminRouter.post(
  "/customers",
  authMiddleware,
  isAdmin,
  adminControllers.FETCH_CUSTOMERS
);

//BLOCK ONE CUSTOMER
AdminRouter.put(
  "/customers/block",
  authMiddleware,
  isAdmin,
  adminControllers.BLOCK_CUSTOMER
);

//Unblock one user///
AdminRouter.put(
  "/customers/unblock",
  authMiddleware,
  isAdmin,
  adminControllers.UNBLOCK_CUSTOMER
);

///DELETE ONE CUSTOMERS///
AdminRouter.delete(
  "/customers/delete",
  authMiddleware,
  isAdmin,
  adminControllers.DELETE_ONE_CUSTOMER
);

//FETCH ONE CUSTOMER DETAILS//
AdminRouter.post(
  "/customers/details",
  authMiddleware,
  isAdmin,

  adminControllers.FETCH_CUSTOMER_DETAILS
);

//cutomers orders///

AdminRouter.get("/ordersayalysis", adminControllers.FETCH_ORDERS_ANALYSIS);

AdminRouter.post(
  "/customers/orders",
  authMiddleware,
  isAdmin,
  adminControllers.FETCH_ORDERS
);

AdminRouter.post(
  "/customers/orders/details",
  adminControllers.FETCH_ORDER_DETAILS
);

AdminRouter.put(
  "/customers/orders/updateorder",
  authMiddleware,
  isAdmin,
  adminControllers.UPDATE_ORDER 
);

AdminRouter.put(
  "/customers/orders/deleteorder",
  authMiddleware,
  isAdmin,
  adminControllers.DELETE_ORDER
);

//===============================================================================products routes===================================================================>


AdminRouter.get("/products/details/:id", adminControllers.FETCH_ONE_PRODUCT);

AdminRouter.post("/products/availableId", adminControllers.AVAIABLE_ID);

//fetch products//
AdminRouter.post(
  "/products",
  // authMiddleware,
  // isAdmin,
  adminControllers.FETCH_PRODUCT
);

// AdminRouter.post("/searchproudct", adminControllers.SEARCH_PRODUCT);

AdminRouter.post(
  "/products/addproduct",
  authMiddleware,

  adminControllers.ADD_PRODUCT
);
AdminRouter.delete(
  "/products/deleteproduct",
  authMiddleware,
  isAdmin,

  adminControllers.DELETE_PRODUCT
);

AdminRouter.put(
  "/removeimagefromproduct",
  adminControllers.REMOVE_IMAGE_FROM_PRODUCT
);
AdminRouter.put(
  "/removethumnailfromproduct",
  adminControllers.REMOVE_THUMNAIL_FROM_PRODUCT
);

AdminRouter.put(
  "/products/updateproduct",
  authMiddleware,
  isAdmin,

  adminControllers.UPDATE_PRODUCT
);
AdminRouter.put(
  "/addfieldinall",
  authMiddleware,
  isAdmin,
  adminControllers.ADD_FIELD_IN_ALL
);
AdminRouter.put(
  "/removefieldinall",
  authMiddleware,
  isAdmin,
  adminControllers.REMOVE_FIELD_IN_ALL
);
AdminRouter.put(
  "/converfieldvaluelowercase",

  adminControllers.CONVERT_FIELD_VALUE_LOWERCASE
);
AdminRouter.put(
  "/convertfieldtype",

  adminControllers.CONVERTING_FIELD_TYPE
);
AdminRouter.put(
  "/changeonefiledvalueatall",
  adminControllers.CHANGE_ONE_FIELD_VALUE
);

// AdminRouter.put("/changefieldname",adminControllers.CHANGE_FIELD_IN_ALL);

//=================================-====================================================COUPON ROUTES======================================================================>

AdminRouter.get(
  "/coupons",
  authMiddleware,
  isAdmin,
  adminControllers.FETCH_COUPONS
);
AdminRouter.post(
  "/coupons/createcoupon",
  authMiddleware,
  isAdmin,
  adminControllers.CREATE_COUPON
);
AdminRouter.delete(
  "/coupons/deletecoupon",
  authMiddleware,
  isAdmin,
  adminControllers.DELETE_COUPON
);

//export admin router
module.exports = AdminRouter;

//=========================================================================================ADD PROPERTIES=============================================================================>

AdminRouter.post("/createproperties", adminControllers.CREATE_PROPERTIES);
AdminRouter.get("/fetchproperties", adminControllers.FETCH_PROPERTIES);
AdminRouter.put("/addproperties", adminControllers.ADD_PROPERTIES);
AdminRouter.put("/deleteproperties", adminControllers.DELETE_PROPERTIES);

AdminRouter.post(
  "/addimage",
  // authMiddleware,
  // isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  adminControllers.ADD_IMAGE
);

AdminRouter.delete(
  "/deleteimage",
  // authMiddleware,
  // isAdmin,
  adminControllers.DELETE_IMAGE
);

AdminRouter.post(
  "/addimagetoproduct",
  uploadPhoto1.array("images", 10),
  productImgResize1,
  adminControllers.ADD_IMAGE_TO_PRODUCT
);
AdminRouter.post(
  "/addthumnailtoproduct",
  uploadPhoto1.array("images", 10),
  productImgResize1,
  adminControllers.ADD_THUMNAIL_TO_PRODUCT
);

AdminRouter.get(
  "/FETCH_PROPERTIES_DETAILS",
  adminControllers.FETCH_PROPERTIES_DETAILS
);

AdminRouter.put("/delete/removefield",adminControllers.DELETE_FIELD)