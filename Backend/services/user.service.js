const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
}) => {
  if (!firstname || !email || !password) {
    throw new Error("Please fill in all fields");
  }
  const newUser = userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });
  return newUser;
};
