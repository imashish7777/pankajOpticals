const nodemailer = require("nodemailer");
const AsynceHandler = require("express-async-handler");
const SubscribeModel = require("../Models/Subscribe.model");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  // auth: {
  //   user: process.env.MAIL_ID,
  //   pass: process.env.MAIL_PW,
  // },
});

module.exports.SEND_EMAIL = AsynceHandler(async (data, req, res) => {
  const info = await transporter.sendMail({
    from: '"Hey 👻" <ashishkumar155223@gmail.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm,
  });

});

module.exports.SUBSCRIBE = AsynceHandler(async (req, res) => {
  try {
    await SubscribeModel.create(req.body);
    res.sendStatus(200);
  } catch (error) {
    throw new Error(error);
  }
});
