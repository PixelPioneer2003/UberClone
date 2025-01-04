const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const BlacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;
  console.log(fullname + " " + email + " " + password);
  const isEmailExist = await userModel.findOne({ email });
  if (isEmailExist) {
    return res.status(400).json({ message: "Email  user  already exist" });
  }
  const hashedPassword = await userModel.hashPassword(password);
  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });
  const token = user.generateAuthToken();
  res.status(201).json({ user, token });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "invalid email or password 1" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "invalid email or password 2" });
  }
  const token = user.generateAuthToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ user, token });
};
module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  console.log("logoutUser");
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("Authorization header is missing");
    }

    const token = req.cookies.token || authHeader.split(" ")[1];
    console.log(token + "token");
    if (!token) {
      console.log("Token missing");
    }
    res.clearCookie("token");
    await BlacklistTokenModel.create({ token });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log("logout user error");
    console.log(error);
  }
};
