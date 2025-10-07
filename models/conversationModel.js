const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
  type: { type: String, enum: ["direct", "group"], required: true },
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "profiles", required: true },
  ],
  name: { type: String }, // optional (mainly for groups)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conversation", ConversationSchema);
