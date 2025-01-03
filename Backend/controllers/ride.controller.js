const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
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
    res.status(201).json(ride);
  } catch (error) {
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
