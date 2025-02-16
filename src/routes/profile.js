const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { userAuth } = require("../utils/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.json(loggedInUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allowedFields = [
      "firstName",
      "lastName",
      "about",
      "gender",
      "age",
      "photoUrl",
      "hobbies",
    ];
    const isAllowedField = Object.keys(req.body).every((field) =>
      allowedFields.includes(field)
    );
    if (!isAllowedField) {
      throw new Error("invalid field to update");
    }
    Object.keys(req.body).map((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.json(loggedInUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
profileRouter.post("/profile/forgotPassword", async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}//${req.get(
      "host"
    )}/resetPassword/${resetToken}`;
    const message = `Forgot your password? Please click this link to reset your password: ${resetUrl}`;
    await sendEmail({
      emailId: user.emailId,
      subject: "Password Reset",
      text: message,
    });
    res.json({ message: "Reset password email sent" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
profileRouter.patch("/profile/resetPassword/:token", async (req, res) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiration = null;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = profileRouter;
