const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = authRouter;
