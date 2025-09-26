const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");
const app = express();
app.use(cors({ origin: "*" })); // whenerver request comes from this origin, allow it, means change kr dena jo bhi port ho
app.use(express.json());

// Routes
app.use("/", authRoutes);
app.use("/posts", postRoutes);
app.use("/messages", messageRoutes);
module.exports = app;
