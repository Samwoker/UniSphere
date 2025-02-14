const express = require("express");
const profileRouter = express.Router();

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

module.exports = profileRouter;
