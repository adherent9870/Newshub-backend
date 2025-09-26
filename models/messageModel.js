const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message must have content"],
  },
  time: {
    type: Date,
    default: Date.now,
  },
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profiles",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profiles",
    required: true,
  },
});

module.exports = mongoose.model("Message", PostSchema);
