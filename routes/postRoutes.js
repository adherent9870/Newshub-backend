const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.get("/:id", postController.getPostById);
router.get("/", postController.getAllPosts);
router.post("/", postController.createPost);
router.delete("/:id", postController.deletePost);
module.exports = router;
