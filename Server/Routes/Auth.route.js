// const { Router } = require('express');
const express = require("express");
const authController = require("../Controllers/authControllers");
const emailController = require("../Controllers/emailController");

const Authrouter = express.Router();
Authrouter.use(express.json());
const { authMiddleware, isblocked } = require("../MIddleware/authMiddleware");

//ask quries//
Authrouter.post("/askQurey", authController.ASK_QUERY);
Authrouter.post("/subscribe", emailController.SUBSCRIBE);

//User Routes//
Authrouter.get("/isAuthicated", authMiddleware, authController.isAuthicated);
Authrouter.post("/signup", authController.SIGNUP);
Authrouter.post("/login", isblocked, authController.LOGIN);
Authrouter.post("/logout", authController.LOGOUT);
Authrouter.get("/refreshtoken", authController.REFRESH_TOKEN);
Authrouter.delete("/delete", authMiddleware, authController.DELETE_ACCOUNT);

//forget password and update password//

Authrouter.post("/forgotpasswordtoken", authController.FORGOT_PASSWORD_TOKEN);
Authrouter.put("/resetpassword/:token", authController.RESET_PASSWORD);
Authrouter.put(
  "/updatepassword",
  authMiddleware,
  isblocked,
  authController.UPDATE_PASSWORD
);

//address routes//
Authrouter.post(
  "/addAddress",
  authMiddleware,
  isblocked,
  authController.ADD_ADDRESS
);
Authrouter.get(
  "/getAddress",
  authMiddleware,
  isblocked,
  authController.FETCH_ADDRESS
);
Authrouter.delete(
  "/deleteAddress/:id",
  authMiddleware,
  isblocked,
  authController.DELETE_ADDRESS
);
Authrouter.put("/update", authMiddleware, authController.UPDATE_ACCOUNT);
Authrouter.post(
  "/updateAddress/:addressId",
  authMiddleware,
  isblocked,
  authController.UPDATA_ADDRESS
);

module.exports = Authrouter;
