const express = require("express");
const Sale = require("../models/salesModel");
const router = express.Router();

// Calculate total revenue
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

// Find quantity sold for each product
router.get("/quantity-by-product", async (req, res) => {
  try {
    const quantityByProduct = await Sale.aggregate([
      { $group: { _id: "$product", totalQuantity: { $sum: "$quantity" } } },
    ]);

    res.json(quantityByProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching quantity by product");
  }
});

// Retrieve top 5 products by revenue
router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await Sale.aggregate([
      {
        $group: {
          _id: "$product",
          totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

    res.json(topProducts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching top products");
  }
});

// Calculate average price
router.get("/average-price", async (req, res) => {
  try {
    const averagePrice = await Sale.aggregate([
      { $group: { _id: null, averagePrice: { $avg: "$price" } } },
    ]).project({ _id: 0 });

    res.json(averagePrice);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error calculating average price");
  }
});

// Group revenue by month and year
router.get("/revenue-by-month", async (req, res) => {
  try {
    const revenueByMonth = await Sale.aggregate([
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);

    res.json(revenueByMonth);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching revenue by month");
  }
});

// Find product with highest quantity sold on a single day
router.get("/highest-quantity-sold", async (req, res) => {
  try {
    const highestQuantitySold = await Sale.aggregate([
      { $group: { _id: "$product", maxQuantity: { $max: "$quantity" } } },
      { $sort: { maxQuantity: -1 } },
      { $limit: 1 },
    ]);

    res.json(highestQuantitySold);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product with highest quantity sold");
  }
});

// Calculate total salary expense for each department (not implemented in the model)
router.get("/department-salary-expense", async (req, res) => {
  try {
    const departmentExpenses = await Department.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "department",
          as: "employees",
        },
      },
      {
        $unwind: "$employees",
      },
      {
        $group: {
          _id: "$_id",
          departmentName: { $first: "$name" },
          totalSalaryExpense: { $sum: "$employees.salary" },
        },
      },
    ]);

    res.json(departmentExpenses);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error calculating department salary expenses");
  }
});

module.exports = router;
