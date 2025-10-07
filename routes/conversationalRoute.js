const conversationalController = require("../controllers/conversationalController");
const express = require("express");
const router = express.Router();

router.post("/direct", conversationalController.createDirectConversation);
router.post("/group", conversationalController.createGroupConversation);
router.get("/:id", conversationalController.getUserConversations);

module.exports = router;
