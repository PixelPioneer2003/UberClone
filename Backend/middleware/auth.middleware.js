const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BlacklistTokenModel = require("../models/blacklistToken.model");
require("dotenv").config();
module.exports.authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = req.cookies.token || authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }
  const isBlackListed = await BlacklistTokenModel.findOne({ token });
  if (isBlackListed) {
    return res.status(401).json({ message: "Unauthorized: Token blacklisted" });
  }

  try {
    const decode = jwt.decode(token); // Convert from Unix timestamp to human-readable time

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Unauthorized here" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.header.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const isBlackListed = await BlacklistTokenModel.findOne({ token });
  if (isBlackListed) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded.id);
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }
    req.captain = captain;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
