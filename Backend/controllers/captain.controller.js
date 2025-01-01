const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, vehicle } = req.body;
  const isEmailExist = await captainModel.findOne({ email });
  if (isEmailExist) {
    return res.status(400).json({ message: "Email already exist" });
  }
  const hashedPassword = await captainService.captionModel.hashPassword(
    password
  );
  const captain = await createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
    plate: vehicle.plate,
  });

  const token = captain.generateAuthToken();
  res.status(201).json({ captain, token });
};
module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(401).json({ message: "invalid email or password" });
  }
  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
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
  const token = req.cookies.token || req.header.authorization.split(" ")[1];
  await BlacklistTokenModel.create({ token });
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};
