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
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middlewares
app.use(express.json());

// Routes
app.use("/api/sales", router);

// Start server
module.exports = app;
