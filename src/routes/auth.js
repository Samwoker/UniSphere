const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpApi } = require("../utils/validation");
const { userAuth } = require("../utils/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    validateSignUpApi(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.json({ message: "user signed in successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ _id: user._id }, "UniSphereApp", {
      expiresIn: "7d",
    });
    res.cookie("token", token);
    res.json({ message: "User logged in successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.json({
      message: `User ${loggedInUser.firstName} logged out successfully`,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = authRouter;
