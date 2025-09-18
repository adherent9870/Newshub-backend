const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Profiles = require("../models/userModel");
const sendEmail = require("../routes/utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const newUser = await Profiles.create(req.body);
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check email & password exist
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email & password" });
    }

    // 2) Find user + check password
    const user = await Profiles.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // 3) If ok -> send token
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const user = await Profiles.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "No user with that email" });

    // Generate reset token
    const resetToken = Profiles.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset link via email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;

    const message = `Forgot password? Submit a PATCH request with your new password & confirm password to: ${resetURL}`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({ status: "success", message: "Token sent to email!" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await Profiles.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token invalid or expired" });

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
