const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");

router.get("/offers", async (req, res) => {
  try {
    let filter = {};

    // filter by title
    req.query.title ? (filter.product_name = new RegExp(req.query.title, "i")) : null;

    // filter by title and price max
    req.query.title && req.query.priceMax
      ? ((filter.product_name = new RegExp(req.query.title, "i")), (filter.product_price = { $lte: req.query.priceMax }))
      : null;

    //filter by price min only
    req.query.priceMin ? (filter.product_price = { $gte: req.query.priceMin }) : null;

    // filter by price max and price min
    if (req.query.priceMax) {
      if (filter.product_price) {
        filter.product_price.$lte = req.query.priceMax;
      } else {
        filter.product_price = { $lte: req.query.priceMax };
      }
    }

    // sort by price asc and desc
    let sort = {};
    if (req.query.sort === "price-desc") {
      sort.product_price = "desc";
    } else if (req.query.sort === "price-asc") {
      sort.product_price = "asc";
    }

    //offre limit par page
    let offerLimitParPage = req.query.limit ? req.query.limit : 4;

    let page = req.query.page < 1 ? 1 : req.query.page;

    const count = await Offer.countDocuments(filter);

    const result = await Offer.find(filter)
      .select("product_name product_price")
      .sort(sort)
      .limit(offerLimitParPage)
      .skip((page - 1) * offerLimitParPage);

    res.status(400).json({ count, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
