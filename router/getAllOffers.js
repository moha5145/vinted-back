const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");

router.get("/offers", async (req, res) => {
  try {
    let filter = {};

    const { title, priceMax, priceMin, sort, limit, page } = req.query;

    // filter by title
    title ? (filter.product_name = new RegExp(title, "i")) : null;

    // filter by title and price max
    title && priceMax ? ((filter.product_name = new RegExp(title, "i")), (filter.product_price = { $lte: priceMax })) : null;

    //filter by price min only
    priceMin ? (filter.product_price = { $gte: priceMin }) : null;

    // filter by price max and price min
    if (priceMax) {
      if (filter.product_price) {
        filter.product_price.$lte = priceMax;
      } else {
        filter.product_price = { $lte: priceMax };
      }
    }

    // sort by price asc and desc
    let sorted = {};
    if (sort === "price-desc") {
      sorted.product_price = "desc";
    } else if (sort === "price-asc") {
      sorted.product_price = "asc";
    }

    //offre limit par page
    let offerLimitParPage = limit ? limit : 4;

    let choicedPage = page < 1 ? 1 : page;

    const count = await Offer.countDocuments(filter);

    const result = await Offer.find(filter)
      .select("product_name product_price")
      .sort(sorted)
      .limit(offerLimitParPage)
      .skip((choicedPage - 1) * offerLimitParPage);

    res.status(400).json({ count, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
