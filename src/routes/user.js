const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connection");

const { userAuth } = require("../utils/auth");
userRouter.get("/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $and: [{ toUserId: loggedInUser._id }, { status: "connect" }],
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "about",
      "age",
      "gender",
      "photoUrl",
      "hobbies",
    ]);
    res.json({connections: connections})
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
