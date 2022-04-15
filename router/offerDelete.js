const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middleware/isAuthenticated");
const { application } = require("express");
const cloudinary = require("cloudinary").v2;

router.delete("/offer/delete", isAuthenticated, async (req, res) => {
  try {
    res.json("HELLO");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
