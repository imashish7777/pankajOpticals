const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv").config();

///import routes//
const ProductRouter = require("./Routes/Product.route");
const Authrouter = require("./Routes/Auth.route");
const OrderRouter = require("./Routes/Order.route");
const AdminRouter = require("./Routes/Admin.routes");

///import express///
const app = express();

//middlewares

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Database Connection"
const PORT = process.env.PORT || 3001;
const { connection } = require("./Configs/db");

///root routes///
app.use("/auth", Authrouter);
app.use("/product", ProductRouter);
app.use("/order", OrderRouter);
app.use("/admin", AdminRouter);

//port connection
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to database");
  } catch (err) {
    console.log("unable to connect to database");
  }
});
