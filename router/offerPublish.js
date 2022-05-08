require("dotenv").config();
const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const isAuthenticated = require("../middleware/isAuthenticated");
const cloudinary = require("../config/cloudinaryConfig");

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    // distructur req.fields
    const { title, description, price, brand, size, condition, color, city } = req.fields;

    const newOffer = await new Offer({
      product_name: title,
      product_description: description,
      product_price: price,
      product_details: [{ MARQUE: brand }, { TAILLE: size }, { ÉTAT: condition }, { COULEUR: color }, { EMPLACEMENT: city }],
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
    // console.log(result);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
