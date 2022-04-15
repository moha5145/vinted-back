require("dotenv").config();
const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");

const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("../middleware/isAuthenticated");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    console.log(req.user._id);
    const newOffer = await new Offer({
      product_name: req.fields.title,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: [
        { MARQUE: req.fields.brand },
        { TAILLE: req.fields.size },
        { ÉTAT: req.fields.condition },
        { COULEUR: req.fields.color },
        { EMPLACEMENT: req.fields.city },
      ],
      product_image: { secure_url: "" },
      owner: req.user._id,
    });
    const pictureToUpload = await cloudinary.uploader.upload(req.files.picture.path, {
      folder: `/vinted/offers/`,
      public_id: `${newOffer.title} - ${newOffer._id}`,
    });
    newOffer.product_image = pictureToUpload.secure_url;
    await newOffer.save();

    const result = await Offer.findById(newOffer._id).populate("owner", "-hash -salt -token");

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
