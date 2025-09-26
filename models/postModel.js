const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  header: {
    type: String,
    required: [true, "Post must have a header"],
  },
  content: {
    type: String,
    required: [true, "Post must have content"],
  },
  category: {
    type: String,
    required: [true, "Post must have a category"],
  },
  img: {
    type: String,
  },
  city: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: String,
    },
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profiles",
    },
  ],
  postBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profiles",
    required: true,
  },
});
module.exports = mongoose.model("Post", PostSchema);
