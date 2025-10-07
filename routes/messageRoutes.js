const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messageController");

router.get("/:convoId", messagesController.getConversationMessages);
router.post("/:convoId", messagesController.sendMessage);
module.exports = router;
