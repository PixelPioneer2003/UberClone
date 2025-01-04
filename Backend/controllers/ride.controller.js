const rideService = require("../services/ride.service");
const rideModel = require("../models/ride.model");
const { validationResult } = require("express-validator");
const {
  getAddressCoordinate,
  getCaptainsInTheRadius,
} = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const { request } = require("express");
module.exports.createRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { pickup, destination, vehicleType } = req.body;
    const userId = req.user._id;
    console.log("userId", userId);
    console.log(pickup, destination, vehicleType);
    const ride = await rideService.createRide(
      userId,
      pickup,
      destination,
      vehicleType
    );
    const pickUpCoordinates = await getAddressCoordinate(pickup);
    const radius = 5000000000;
    const captainsInRadius = await getCaptainsInTheRadius(
      pickUpCoordinates.ltd,
      pickUpCoordinates.lng,
      radius
    );
    console.log("captainInRadius", captainsInRadius);
    // send the ride details to all captains in the radius
    // but first hide the otp
    ride.otp = "";
    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");
    captainsInRadius.map((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
    res.status(201).json(ride);
  } catch (error) {
    console.log("error in createRide", error);
    res.status(400).json({ message: error.message });
  }
};
module.exports.getFare = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errors", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    const { pickup, destination } = req.query;
    console.log("pickup", pickup);
    console.log("destination", destination);
    const fare = await rideService.getFare(pickup, destination);
    res.status(200).json(fare);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.confirmRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errors", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;
    console.log("rideId", rideId);
    const captain = req.captain;
    const ride = await rideService.confirmRide(rideId, captain);
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });
    res.status(200).json(ride);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.startRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errors", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    const { rideId, otp } = req.query;
    console.log("rideId", rideId);
    console.log("otp", otp);
    const captain = req.captain;
    const ride = await rideService.startRide(rideId, otp, captain);
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });
    res.status(200).json(ride);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
