const rideModel = require("../models/ride.model");
const { getDistanceTime } = require("../services/maps.service");
const crypto = require("crypto");
module.exports.createRide = async (
  userId,
  pickup,
  destination,
  vehicleType
) => {
  console.log(userId, pickup, destination, vehicleType);

  // Validate required fields
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error("Please provide all required fields");
  }

  // Calculate fare
  const fare = await getFare(pickup, destination);
  console.log("Fare:", fare);

  // Check if the vehicleType is valid
  if (!fare[vehicleType]) {
    throw new Error("Invalid vehicle type");
  }

  // Create a new ride entry in the database
  const ride = await rideModel.create({
    user: userId,
    pickup,
    destination,
    fare: fare[vehicleType],
    otp: getOtp(6), // Use fare for the specific vehicle type
  });

  return ride;
};
function getOtp(num) {
  const otp = crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num) - 1)
    .toString();
  return otp;
}
module.exports.getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Please provide pickup and destination");
  }

  // Get distance and duration from the map service
  const { distance, duration } = await getDistanceTime(pickup, destination);
  // Fare structure for different vehicle types
  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5,
  };

  // Calculate the fare for each vehicle type
  const fare = {
    auto: Math.round(
      baseFare.auto +
        (distance / 1000) * perKmRate.auto +
        (duration / 60) * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        (distance / 1000) * perKmRate.car +
        (duration / 60) * perMinuteRate.car
    ),
    moto: Math.round(
      baseFare.moto +
        (distance / 1000) * perKmRate.moto +
        (duration / 60) * perMinuteRate.moto
    ),
  };

  console.log("Fare:", fare);

  return fare;
};
