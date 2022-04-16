const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/User");

const cloudinary = require("../config/cloudinaryConfig");

router.post("/user/signup", async (req, res) => {
  try {
    // destruct req.fields
    const { username, email, password, newsletter } = req.fields;

    if (!username) {
      res.json({ error: "user name is required" });
    } else {
      const isUserExist = await User.findOne({ email: email });
      if (isUserExist === null) {
        const salt = uid2(30);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(30);

        const newUser = await new User({
          email: email,
          account: { username: username },
          newsletter: newsletter,
          token: token,
          salt: salt,
          hash: hash,
        });

        if (req.files.avatar) {
          const avatarToUpload = await cloudinary.uploader.upload(req.files.avatar, {
            folder: `/vinted/users/avatars`,
            public_id: `${newUser.account.username} - ${newUser._id}`,
          });
          newUser.avatar = avatarToUpload;
        }

        await newUser.save();
        const result = await User.findById(newUser._id).select("_id token account");

        res.json(result);
      } else {
        res.status(400).json({ error: "email already exist" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
