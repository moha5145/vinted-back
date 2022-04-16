require("dotenv").config;
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middleware/isAuthenticated");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.put("/offer/update", isAuthenticated, async (req, res) => {
  try {
    // destruct req.fields
    let { userId, id, title, description, price, condition, city, color, size, brand } = req.fields;

    const user = await User.findOne({ id: userId });
    const publishedOffer = await Offer.findOne({ id: id });

    if (!publishedOffer) {
      res.status(400).json("bad request");
    } else {
      // destruct publishedOffer
      let { product_name, product_description, product_price, product_details } = publishedOffer;

      title ? (product_name = title) : product_name;

      description ? (product_description = description) : product_description;

      price ? (product_price = price) : product_price;

      if (condition || city || brand || size || color) {
        for (let i = 0; i < product_details.length; i++) {
          product_details[i].MARQUE ? (product_details[i].MARQUE = brand) : product_details[i].MARQUE;

          product_details[i].TAILLE ? (product_details[i].TAILLE = size) : product_details[i].TAILLE;

          product_details[i].ÉTAT ? (product_details[i].ÉTAT = condition) : product_details[i].ÉTAT;

          product_details[i].COULEUR ? (product_details[i].COULEUR = color) : product_details[i].COULEUR;

          product_details[i].EMPLACEMENT ? (product_details[i].EMPLACEMENT = city) : product_details[i].EMPLACEMENT;
        }
        if (req.files.picture.path) {
          const pictureToUpload = await cloudinary.uploader.upload(req.files.picture.path, { folder: `/vinted/offers/`, public_id: id });
          publishedOffer.product_image = pictureToUpload.secure_url;
        }
      }

      await publishedOffer.save();
      res.json(publishedOffer);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
