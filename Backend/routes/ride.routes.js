const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const {
  createRide,
  getFare,
  confirmRide,
  startRide,
  endRide,
} = require("../controllers/ride.controller");
const authMiddleware = require("../middleware/auth.middleware");
router.post(
  "/create",
  body("pickup").isString().isLength({ min: 3 }).withMessage("Invalid Pickup"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid Drop"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("Invalid Vehicle Type"),
  authMiddleware.authUser,
  createRide
);
router.get(
  "/get-fare",
  query("pickup").isString().isLength({ min: 3 }).withMessage("Invalid Pickup"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid Drop"),
  authMiddleware.authUser,
  getFare
);
router.post(
  "/confirm",
  body("rideId").isMongoId().withMessage("Invalid Ride Id"),
  // authMiddleware.authCaptain,
  confirmRide
);

router.get(
  "/start-ride",
  query("rideId").isMongoId().withMessage("Invalid Ride Id"),
  query("otp").isString().isLength({ min: 6 }).withMessage("Invalid OTP"),
  // authMiddleware.authCaptain,
  startRide
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  endRide
);

module.exports = router;
