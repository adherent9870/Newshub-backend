const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();
router.get("/test", (req, res) => {
  console.log(req.baseUrl + req.path, "request at test");
  res.status(200).json({ message: "Auth route is working!" });
});
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

module.exports = router;
