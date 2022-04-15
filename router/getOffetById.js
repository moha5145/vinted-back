const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");

router.get("/offer/:id", async (req, res) => {
  try {
    const offerById = await Offer.findById(req.params.id).populate({ path: "owner", select: "account _id" });
    console.log(offerById);
    res.json(offerById);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
