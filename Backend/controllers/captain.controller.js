const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const BlacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerCaptain = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("yha h error 1");
    console.log(errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, vehicle } = req.body;
  const isEmailExist = await captainModel.findOne({ email });
  if (isEmailExist) {
    console.log("email exist bhai");
    return res.status(400).json({ message: "Email already exist" });
  }
  const hashedPassword = await captainModel.hashPassword(password);
  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
    plate: vehicle.plate,
  });
  console.log("reached here");
  const token = captain.generateAuthToken();
  res.status(201).json({ captain, token });
};
module.exports.loginCaptain = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("yha h error 1");
    console.log(errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    console.log("captain not found");
    return res.status(401).json({ message: "invalid email or password" });
  }
  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
    console.log("password not match");
    return res.status(401).json({ message: "invalid email or password" });
  }
  const token = captain.generateAuthToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ token, captain });
};
module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  console.log("logoutCaptain");
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
