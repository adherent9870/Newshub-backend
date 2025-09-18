const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

module.exports = app;
