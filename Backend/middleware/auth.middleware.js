const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
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
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = req.cookies.token || authHeader.split(" ")[1];
  // console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    // Check if the token is blacklisted
    const isBlackListed = await BlacklistTokenModel.findOne({ token });
    if (isBlackListed) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token blacklisted" });
    }

    // Decode the token to inspect its structure (optional, not verified yet)
    const decodedPayload = jwt.decode(token);
    // console.log("Decoded Payload:", decodedPayload);

    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Verified Token Data:", decoded);

    if (!decoded.id) {
      return res
        .status(400)
        .json({ message: "Invalid token: Missing user ID" });
    }

    // Find the captain in the database
    const captain = await captainModel.findById(decoded.id);

    if (!captain) {
      return res.status(404).json({ message: "User not found" });
    }

    req.captain = captain; // Attach captain data to the request object
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
