const Message = require("../models/messageModel");

exports.getConversationMessages = async (req, res) => {
  try {
    console.log("recieved get converstional Message request");
    const { convoId } = req.params;
    const messages = await Message.find({ conversation: convoId })
      .populate("sender", "name email")
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { convoId } = req.params;
    const { senderId, content } = req.body;

    const newMsg = await Message.create({
      conversation: convoId,
      sender: senderId,
      content,
    });

    res.json(newMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
