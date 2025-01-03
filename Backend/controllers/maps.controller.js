const {
  getAddressCoordinate,
  getDistanceTime,
  getAutoCompleteSuggestions,
} = require("../services/maps.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { address } = req.query;
  console.log("Address:", address);
  try {
    const coordinate = await getAddressCoordinate(address);
    console.log("Coordinate:", coordinate);
    res.status(200).json(coordinate);
  } catch (error) {
    res.status(404).json({ message: "coordinates not found" });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;
    const { distance, duration } = await getDistanceTime(origin, destination);
    res.status(200).json({ distance, duration });
  } catch (error) {
    console.error("Error fetching distance and time:", error.message || error);
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { input } = req.query;
    console.log("Input:", input);
    const suggestions = await getAutoCompleteSuggestions(input);
    console.log("Suggestions:", suggestions);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error.message || error);
  }
};
