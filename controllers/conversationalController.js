const Conversation = require("../models/conversationModel");

//---------------------------create direct conversation---------------------------------------//
exports.createDirectConversation = async (req, res) => {
  try {
    console.log(req.body);
    const { userId1, userId2 } = req.body;

    // Check if a direct conversation between these two users already exists
    let conversation = await Conversation.findOne({
      type: "direct",
      participants: { $all: [userId1, userId2], $size: 2 },
    });

    if (conversation) {
      return res.status(200).json({
        status: "success",
        data: {
          conversation,
        },
      });
    }

    // If not, create a new direct conversation
    conversation = await Conversation.create({
      type: "direct",
      participants: [userId1, userId2],
    });

    res.status(201).json({
      status: "success",
      data: {
        conversation,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

//---------------------------create group conversational---------------------------------------//
exports.createGroupConversation = async (req, res) => {
  try {
    const { creatorId, participantIds, name } = req.body;

    if (
      !creatorId ||
      !Array.isArray(participantIds) ||
      participantIds.length === 0
    ) {
      return res.status(400).json({
        status: "fail",
        message: "creatorId and participantIds[] are required",
      });
    }

    const participants = [creatorId, ...participantIds];

    // ✅ Check if a group with the same participants + same name already exists
    const existing = await Conversation.findOne({
      type: "group",
      name,
      participants: { $all: participants, $size: participants.length },
    });

    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "A group with this name and participants already exists",
        conversation: existing,
      });
    }

    // If not, create a new conversation
    const convo = await Conversation.create({
      type: "group",
      participants,
      name,
    });

    res.status(201).json({
      status: "success",
      data: { convo },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

//---------------------------get conversational by userId---------------------------------------//
exports.getUserConversations = async (req, res) => {
  try {
    const { id } = req.params;

    const convos = await Conversation.find({
      participants: id,
    }).populate("participants", "name email");

    res.json(convos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
