const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const { createRide, getFare } = require("../controllers/ride.controller");
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
  // authMiddleware.authUser,
  getFare
);
module.exports = router;
