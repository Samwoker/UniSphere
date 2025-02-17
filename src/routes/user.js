const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connection");

const { userAuth } = require("../utils/auth");

const feedData = "firstName lastName about age gender photoUrl hobbies";
userRouter.get("/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $and: [{ toUserId: loggedInUser._id }, { status: "connect" }],
    }).select("fromUserId", feedData);
    res.json({ connections: connections });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.get("/feed?page&limit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feeds = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "confirm" },
        { fromUserId: loggedInUser._id, status: "confirm" },
      ],
    })
      .skip(skip)
      .limit(limit)
      .select("fromUserId toUserId", feedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
