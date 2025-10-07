const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: function () {
      return this.isNew;
    },
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match!",
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profiles" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profiles" }],

  // Profile Information
  profilePicture: { type: String },
  bio: { type: String, maxlength: 500 },
  gender: {
    type: String,
    enum: ["male", "female", "nonbinary", "other"],
    default: "other",
  },
  dateOfBirth: { type: Date },
  location: {
    city: String,
    country: String,
  },

  // Account Metadata
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },

  // Optional Integrations
  interests: [String],
  occupation: String,
  education: {
    school: String,
    degree: String,
    fieldOfStudy: String,
  },
  skills: [String],
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    github: String,
  },
});

// Hash password before saving
ProfileSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Compare password for login
ProfileSchema.methods.correctPassword = async function (
  candidate,
  userPassword
) {
  return await bcrypt.compare(candidate, userPassword);
};

// Generate reset token
ProfileSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  return resetToken;
};

module.exports = mongoose.model("Profiles", ProfileSchema);
