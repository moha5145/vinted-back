const express = require("express");
const router = express.Router();

const Offer = require("../models/Offer");
const isAuthenticated = require("../middleware/isAuthenticated");

// delete Offer by id
router.delete("/offer/delete", isAuthenticated, async (req, res) => {
  try {
    const deletOffer = await Offer.findByIdAndDelete(req.fields.id);
    if (deletOffer === null) {
      res.status(400).json({ error: "Please enter valid Id" });
    } else {
      res.json({ message: "Offer successfully deleted", offer: deletOffer });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
