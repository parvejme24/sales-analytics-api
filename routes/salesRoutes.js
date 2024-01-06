const express = require("express");
const router = express.Router();
const Sale = require("../models/salesModel");

router.get("/total-revenue", async (req, res) => {
  try {
    const totalRevenue = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]).project({ _id: 0 });

    res.json(totalRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error calculating total revenue");
  }
});

module.exports = router;
