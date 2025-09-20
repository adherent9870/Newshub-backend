const express = require("express");

const router = express.Router();

router.get("/posts", (req, res) => {
  console.log(req.baseUrl + req.path, "request for posts");
  res.status(200).json({ message: "Posts route is working!" });
});
module.exports = router;
