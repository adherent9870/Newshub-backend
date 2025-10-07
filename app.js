const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const message = require("./routes/messageRoutes");
const friends = require("./routes/friendsRoutes");
const conversations = require("./routes/conversationalRoute");
const profileRoutes = require("./routes/profilesRoute");
const app = express();

app.use(cors({ origin: "*" })); // whenerver request comes from this origin, allow it, means change kr dena jo bhi port ho
app.use(express.json());

// Routes
app.use("/", authRoutes);
app.use("/profiles", friends);
app.use("/posts", postRoutes);
app.use("/conversation", conversations);
app.use("/messages", message);
app.use("/users", profileRoutes);
module.exports = app;
