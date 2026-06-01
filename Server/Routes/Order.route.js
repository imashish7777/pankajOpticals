const express = require("express");
const orderController = require("../Controllers/orderControllers");
const OrderRouter = express.Router();
const { authMiddleware } = require("../MIddleware/authMiddleware");
const {isblocked}=require("../MIddleware/authMiddleware")

OrderRouter.post("/placeorder", authMiddleware, isblocked,orderController.PLACE_ORDER);
OrderRouter.get("/fetchorders", authMiddleware, orderController.FETCH_ORDERS);
OrderRouter.post("/fetchorderdetails",authMiddleware,orderController.FETCH_ORDER_DETAILS);
// didn't complete yet.
// OrderRouter.put("/updateorder",orderController.UPDATE_ORDER);
// OrderRouter.put("/cancelorder",authMiddleware,orderController.CANCEL_ORDER);
// OrderRouter.put("/returnorder",authMiddleware,orderController.RETURN_ORDER);



module.exports = OrderRouter;