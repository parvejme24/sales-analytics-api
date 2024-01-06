require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const salesRoutes = require("./routes/sales.routes");
require("dotenv").config();

const app = express();

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
app.use("/api/sales", salesRoutes);

// Start server
module.exports = app;
