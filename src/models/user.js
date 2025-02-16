const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "{VALUE} is not a valid email address",
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message: "password is not strong",
      },
    },
    about: {
      type: String,
      default: "Bio",
    },
    photoUrl: {
      type: String,
      default:
        "https://th.bing.com/th?id=OIP.zCAXDuwn_eW3SyVWfZueyQHaJ4&w=216&h=288&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
    },
    hobbies: {
      type: [String],
      default: [],
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiration: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const encryptedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordToken = encryptedToken;
  this.resetPasswordTokenExpiration = Date.now() + 10 * 60 * 1000; // 1 hour
  console.log(resetToken);
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
