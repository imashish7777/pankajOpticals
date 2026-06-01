const AsynceHandler = require("express-async-handler");

//NOT FOUND////

const NOT_FOUND = async (req, res, next) => {
  const error = new Error(`NOT FOUND :${req.originalUrl()}`);
  res.status(404);
  next();
};

//ERROR_OCCURS
const ERROR_OCCURS = async (err, req, res, next) => {
  const statusCode = req.statusCode === 200 ? 500 : req.statusCode();
  res.status(statusCode);
  res.json({
    message: err?.message,
    stack: stack?.stack,
  });
};

module.exports = { NOT_FOUND, ERROR_OCCURS };
