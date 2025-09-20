const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  heading: {
    type: String,
  },
  content: {
    type: String,
  },
  category: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
