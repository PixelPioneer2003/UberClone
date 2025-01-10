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
  const fare = await module.exports.getFare(pickup, destination);
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

  // console.log("Fare:", fare);

  return fare;
};

module.exports.confirmRide = async (rideId, captain) => {
  if (!rideId) {
    throw new Error("Please provide rideId");
  }
  console.log("confirm ride in serviices");
  console.log("ride id" + rideId);
  console.log(captain);
  const ride = await rideModel
    .findOneAndUpdate(
      { _id: rideId },
      { status: "accepted", captain: captain },
      { new: true }
    )
    .populate("user")
    .populate("captain")
    .select("+otp");
  console.log("printing the ride in cofirm ride");
  console.log(ride);
  if (!ride) {
    throw new Error("Ride not found");
  }
  console.log("ride confirmed in backend");
  return ride;
};

module.exports.startRide = async (rideId, otp, captain) => {
  if (!rideId || !otp) {
    throw new Error("Please provide rideId and OTP");
  }
  console.log("start ride services");
  const ride = await rideModel
    .findOne({ _id: rideId })
    .populate("captain")
    .populate("user")
    .select("+otp");
  if (!ride) {
    throw new Error("no SUCH RIDE OTP");
  }
  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );
  console.log(ride);

  return ride;
};

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
    }
  );

  return ride;
};
