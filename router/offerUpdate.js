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
    const user = await User.findOne({ id: req.fields.userId });
    const publishedOffer = await Offer.findOne({ id: req.fields.id });

    if (!publishedOffer) {
      res.status(400).json("bad request");
    } else {
      if (req.fields.title) {
        publishedOffer.product_name = req.fields.title;
      }
      if (req.fields.description) {
        publishedOffer.product_description = req.fields.description;
      }
      if (req.fields.price) {
        publishedOffer.product_price = req.fields.price;
      }
      if (req.fields.condition || req.fields.city || req.fields.brand || req.fields.size || req.fields.color) {
        for (let i = 0; i < publishedOffer.product_details.length; i++) {
          // product_description = req.fields.price;
          if (publishedOffer.product_details[i].MARQUE) {
            publishedOffer.product_details[i].MARQUE = req.fields.brand;
          }
          if (publishedOffer.product_details[i].TAILLE) {
            publishedOffer.product_details[i].TAILLE = req.fields.size;
          }
          if (publishedOffer.product_details[i].ÉTAT) {
            publishedOffer.product_details[i].ÉTAT = req.fields.condition;
          }

          if (publishedOffer.product_details[i].COULEUR) {
            publishedOffer.product_details[i].COULEUR = req.fields.color;
          }
          if (publishedOffer.product_details[i].EMPLACEMENT) {
            publishedOffer.product_details[i].EMPLACEMENT = req.fields.city;
          }
        }
        if (req.files.picture.path) {
          const pictureToUpload = await cloudinary.uploader.upload(req.files.picture.path, { folder: `/vinted/offers/`, public_id: req.fields.id });
          console.log(pictureToUpload);
          publishedOffer.product_image = pictureToUpload.secure_url;
        }
      }

      //   console.log("hello");
      await publishedOffer.save();
      res.json(publishedOffer);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
