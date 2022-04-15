const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const userToken = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: userToken });
    if (!user) {
      res.status(400).json({ error: "Unauthorized" });
    } else {
      req.user = user;
      // console.log("midelwer", req.user);
      next();
    }
  } else {
    res.status(400).json({ error: "Unauthorized / token non envoyé" });
  }
};

module.exports = isAuthenticated;
