require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/salesRoutes");
require("dotenv").config();
var bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Sels-Analytics-API Server" });
});

app.get("*", (req, res) => {
  res.status(401).json({message: "Invalid Routes."})
});

// Routes
app.use("/api/sales", router);

module.exports = app;
