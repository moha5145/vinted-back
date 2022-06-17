const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/User");

router.post("/user/login", async (req, res) => {
  try {
    if (req.fields.email === "" || req.fields.password === "") {
      res.status(400).json({ error: "All fields are required" });
    } else {
      const user = await User.findOne({ email: req.fields.email });

      if (!user) {
        res.status(400).json({ error: "Acount not found" });
      } else {
        const salt = user.salt;
        const password = req.fields.password;
        const hash = SHA256(password + salt).toString(encBase64);
        // const token = uid2(30);
        if (hash === user.hash) {
          console.log(user.account);
          res.json({ _id: user.id, token: user.token, account: user.account });
        } else {
          res.status(400).json({ error: "password or email is not corect" });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
