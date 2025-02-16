const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["connect", "confirm", "ignore"],
    },
  },
  {
    timestamps: true,
  }
);

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);
module.exports = ConnectionRequest;
