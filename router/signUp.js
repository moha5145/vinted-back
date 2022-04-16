const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    // console.log(!user.account.username);
    if (!req.fields.username) {
      res.json({ error: "user name is required" });
    } else {
      const isUserExist = await User.findOne({ email: req.fields.email });
      if (isUserExist === null) {
        const salt = uid2(30);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const token = uid2(30);

        const user = await new User({
          email: req.fields.email,
          account: { username: req.fields.username },
          newsletter: req.fields.newsletter,
          token: token,
          salt: salt,
          hash: hash,
        });

        await user.save();
        res.json({ _id: user.id, token: user.token, account: user.account });
      } else {
        res.status(400).json({ error: "email already exist" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
