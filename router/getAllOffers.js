const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const { all } = require("./user");

router.get("/offers", async (req, res) => {
  try {
    // if ( req.query.page || req.query.title || req.query.priceMin || req.query.priceMin || req.query.sort {
    //   if (req.query.page) {
    //     const limitByPage = 2;
    //     if (req.query.page == 1) {
    // const offerByPage = await Offer.find().limit(limitByPage).skip(0);
    //       const count = offerByPage.length;
    //       res.json({ count, offerByPage });
    //     } else if (req.query.page == 2) {
    //       const offerByPage = await Offer.find()
    //         .limit(limitByPage)
    //         .skip(limitByPage);
    //       const count = offerByPage.length;
    //       res.json({ count, offerByPage });
    //     } else if (req.query.page > 2) {
    //       const offerByPage = await Offer.find()
    //         .limit(limitByPage)
    //         .skip(limitByPage * req.query.page);
    //       const count = offerByPage.length;
    //       res.json({ count, offerByPage });
    //     }
    //   } else if (req.query.sort === "price-asc" && req.query.title) {
    //     console.log("hi");
    //     const findByTitleAndSort = await Offer.find({
    //       product_name: RegExp(req.query.title, "i"),
    //     }).sort({ product_price: "asc" });

    //     const count = findByTitleAndSort.length;
    //     res.json({ count, findByTitleAndSort });
    //   } else if (req.query.title) {
    //     const findOffersByTitle = await Offer.find({
    //       product_name: RegExp(req.query.title, "i"),
    //     });
    //     const count = findOffersByTitle.length;
    //     res.json({ count, findOffersByTitle });
    //   } else if (req.query.priceMin && req.query.priceMax) {
    //     const findOffersByPrice = await Offer.find({
    //       product_price: { $gte: req.query.priceMin, $lte: req.query.priceMax },
    //     });
    //     findOffersByPrice;
    //     const count = findOffersByPrice.length;
    //     res.json({ count, findOffersByPrice });
    //   } else if (req.query.title && req.query.priceMax) {
    //     const findOffersByPrice = await Offer.find({
    //       product_name: new RegExp(req.query.title, "i"),
    //       product_price: { $lte: req.query.priceMax },
    //     });
    //     const count = findOffersByPrice.length;
    //     res.json({ count, findOffersByPrice });
    //   } else if (req.query.sort) {
    //     if (req.query.sort === "price-desc") {
    //       const findByDescPrice = await Offer.find().sort({
    //         product_price: "desc",
    //       });
    //       const count = findByDescPrice.length;
    //       res.json({ count, findByDescPrice });
    //     } else if (req.query.sort === "price-asc") {
    //       const findByAscPrice = await Offer.find().sort({
    //         product_price: "asc",
    //       });
    //       const count = findByAscPrice.length;
    //       res.json({ count, findByAscPrice });
    //     }
    //   } else {
    //     const allOffers = await Offer.find();

    //     res.json(allOffers);
    //   }
    // }

    // const allOffers = await Offer.find();

    let filter = {};

    req.query.page == 1 ? await Offer.find(filter).limit(2).skip(0) : null;
    // filter by title
    req.query.title ? (filter.product_name = new RegExp(req.query.title, "i")) : null;

    // filter by title and price max
    req.query.title && req.query.priceMax
      ? ((filter.product_name = new RegExp(req.query.title, "i")), (filter.product_price = { $lte: req.query.priceMax }))
      : null;

    console.log(filter);
    // filter by price max and price min
    req.query.priceMin && req.query.priceMax ? (filter.product_price = { $gte: req.query.priceMin, $lte: req.query.priceMax }) : null;

    // filter by price max only
    req.query.priceMax ? (filter.product_price = { $lte: req.query.priceMax }) : null;

    //filter by price min only
    req.query.priceMin ? (filter.product_price = { $gte: req.query.priceMin }) : null;

    // filter by price asc

    const count = await Offer.countDocuments(filter);
    const result = await Offer.find(filter);
    res.status(400).json({ count, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
