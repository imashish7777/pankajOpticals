const userModel = require("../Models/User.model");
const AsynceHandler = require("express-async-handler");

///token verificaton///
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../Configs/env");
function authMiddleware(req, res, next) {
  const token = req.header("x-auth-token");
  // Check for token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret());
    //Add user from payload

    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
}

//is Admin middleware

const isAdmin = AsynceHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId);
  if (user && user.role === "admin") {
    next();
  } else {
    res.json("you dont't have authorization on this action");
  }
});

const isblocked = AsynceHandler(async (req, res, next) => {
  const userEmail = req?.body?.email;
  if (userEmail) {
    try {
      const user = await userModel.findOne({ email: userEmail });
      if (user.isblocked) {
        res.json("SIGNIN_DENIED");
      } else {
        next();
      }
    } catch {
      res.json("BAD_REQUEST");
    }
  } else {
    const { _id } = req.user;
    try {
      const user = await userModel.findById(_id);
      if (user.isblocked) {
        res.json();
      } else {
        next();
      }
    } catch {
      res.json("BAD_REQUEST");
    }
  }
});

module.exports = { isAdmin, authMiddleware, isblocked };
