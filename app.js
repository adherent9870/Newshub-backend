const express = require("express");
const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoute");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://127.0.0.1:5500" })); // whenerver request comes from this origin, allow it, means change kr dena jo bhi port ho

app.use(express.json());

// Routes
app.use("/", authRoutes);
app.use("/", postsRoutes);
module.exports = app;
