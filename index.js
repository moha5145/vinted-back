require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(formidable());
app.use(cors());

const user = require("./router/signUp");
app.use(user);

const login = require("./router/login");
app.use(login);

const offerPublish = require("./router/offerPublish");
app.use(offerPublish);

const offerUpdate = require("./router/offerUpdate");
app.use(offerUpdate);

const offerDelete = require("./router/offerDelete");
app.use(offerDelete);

const offers = require("./router/getAllOffers");
app.use(offers);

const offerByPramId = require("./router/getOffetById");
app.use(offerByPramId);

app.get("*", (req, res) => {
  res.status(400).json("Pages not found !");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server listening port : ${port}`);
});
