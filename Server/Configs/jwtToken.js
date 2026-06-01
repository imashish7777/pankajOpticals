const jwt = require("jsonwebtoken");
const AsynceHandler = require("express-async-handler");
const { jwtSecret } = require("./env");

const generateToken = AsynceHandler(async (_id) => {
  return await jwt.sign({ _id }, jwtSecret(), { expiresIn: "1d" });
});

const generateRefreshToken = AsynceHandler(async (_id) => {
  return await jwt.sign({ _id }, jwtSecret(), {
    expiresIn: "7d",
  });
});

module.exports = { generateToken, generateRefreshToken };
