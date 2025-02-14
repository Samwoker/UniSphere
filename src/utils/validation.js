const validator = require("validator");
const validateSignUpApi = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("firstName and lastName are required");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("password is weak please enter a strong password");
  }
};

module.exports = {
  validateSignUpApi,
};
