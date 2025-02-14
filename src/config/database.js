const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://samwoker112:cOTva4BWgMMWVhy5@unisphere.wki4u.mongodb.net/"
  );
};
module.exports = connectDb;
