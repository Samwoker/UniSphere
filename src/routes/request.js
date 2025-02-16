const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../utils/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connection");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const toUserId = req.params.userId;
      const fromUserId = loggedInUser._id;
      if (status !== "connect") {
        throw new Error("invalid status type");
      }
      const toUser = await User.findById({ _id: toUserId });
      if (!toUser) {
        throw new Error("User not found");
      }
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: loggedInUser._id, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: loggedInUser._id },
        ],
      });
      if (fromUserId.equals(toUserId)) {
        throw new Error("Cannot send request to yourself");
      }
      if (existingRequest) {
        throw new Error("Request already sent");
      }
      const newRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await newRequest.save();
      res.json({ newRequest: newRequest });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const allowedStatus = ["confirm", "ignore"];

      const status = req.params.status;
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }
      const requestId = req.params.requestId;
      const request = await ConnectionRequest.findById({ _id: requestId });
      if (!request) {
        throw new Error("there is no request currently");
      }
      if (!request.toUserId.equals(loggedInUser._id)) {
        throw new Error("You are not the recipient of this request");
      }

      request.status = status;

      await request.save();
      res.json({ updatedRequest: request });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
