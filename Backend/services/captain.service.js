const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  capacity,
  vehicleType,
  plate,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !color ||
    !capacity ||
    !vehicleType ||
    !plate
  ) {
    throw new Error("Please fill in all fields");
  }
  const newCaptain = captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color,
      capacity,
      vehicleType,
      plate,
    },
  });
  return newCaptain;
};
