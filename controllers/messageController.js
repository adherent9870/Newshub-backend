const messages = require("../models/messageModel");
exports.getAllMessages = async (req, res) => {
  try {
    const allMessages = await messages.find().populate("by to", "name email");
    res.json(allMessages);
  } catch (error) {
    res.status(500).send("Error retrieving messages");
  }
};

exports.createMessage = async (req, res) => {
  try {
    const newMessage = new messages(req.body);
    await newMessage.save();
    res.status(201).send("Message created successfully");
  } catch (error) {
    res.status(500).send("Error creating message");
  }
};
