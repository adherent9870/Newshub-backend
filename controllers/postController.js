const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Post = require("../models/postModel");
const { post } = require("../routes/postRoutes");

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "postBy",
      "name email"
    );

    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { post },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.getPostByUserId = async (req, res) => {
  try {
    const posts = await Post.find({ postBy: req.body.user }).populate(
      "postBy",
      "name email"
    );
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: { posts },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    console.log("get all posts request recieved");
    // Populate 'postBy' to fetch user details
    const posts = await Post.find().populate("postBy", "name email");

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: { posts },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ status: "fail", message: "Invalid token" });
    }

    // Create new post
    const newPost = await Post.create({
      header: req.body.header,
      content: req.body.content,
      category: req.body.category,
      city: req.body.city,
      img: req.body.img,
      likes: req.body.likes || 0,
      comments: req.body.comments || [],
      postBy: decoded.id, // Use the user ID from the token
    });

    res.status(201).json({
      status: "success",
      data: { post: newPost },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    console.log("delete the post request recieved");
    // Extract token from Authorization header
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized, you are not allowed for this action",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ status: "fail", message: "Invalid token" });
    }
    // console.log(decoded);
    // Find the post to ensure it exists and belongs to the user
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ status: "fail", message: "Post not found" });
    }
    if (post.postBy.toString() !== decoded.id) {
      return res.status(403).json({ status: "fail", message: "Forbidden" });
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.likePost = async (req, res) => {};
