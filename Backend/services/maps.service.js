require("dotenv").config();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
const axios = require("axios");
const captainModel = require("../models/captain.model");
module.exports.getAddressCoordinate = async (address) => {
  try {
    // Construct the URL with API key and address
    const url = `https://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(
      address
    )}`;

    // Make the API request
    const response = await axios.get(url);

    // Extract data
    const results = response?.data?.data;
    if (!results || results.length === 0) {
      throw new Error("No results found for the given address.");
    }

    // Extract latitude and longitude from the first result
    const { latitude: lat, longitude: lng } = results[0];
    return { lat, lng };
  } catch (error) {
    console.error(
      "Error fetching coordinates:",
      error.message || error.response?.data || error
    );
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  console.log("origin", origin);
  console.log("destination", destination);

  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  try {
    const url1 = `https://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(
      origin
    )}`;
    // Fetch coordinates for origin
    const originResponse = await axios.get(url1);
    const url2 = `https://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(
      destination
    )}`;
    const destinationResponse = await axios.get(url2);

    // Extract coordinates
    const originData = originResponse.data?.data?.[0];
    const destinationData = destinationResponse.data?.data?.[0];
    if (!originData || !destinationData) {
      throw new Error("Unable to fetch coordinates for the given locations.");
    }

    const originCoordinates = {
      lat: originData.latitude,
      lng: originData.longitude,
    };

    const destinationCoordinates = {
      lat: destinationData.latitude,
      lng: destinationData.longitude,
    };

    // Calculate distance using Haversine formula
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(destinationCoordinates.lat - originCoordinates.lat);
    const dLng = toRadians(destinationCoordinates.lng - originCoordinates.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(originCoordinates.lat)) *
        Math.cos(toRadians(destinationCoordinates.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    // Estimate time assuming an average speed of 60 km/h
    const time = (distance / 60) * 60 * 60; // Time in seconds

    return {
      distance: distance.toFixed(2) * 1000,
      duration: (time / 60).toFixed(2),
    };
  } catch (error) {
    console.error(
      "Error calculating distance and time:",
      error.message || error
    );
    throw error;
  }
};

// Function to get address autocomplete suggestions
module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Address is required");
  }
  console.log("input", input);
  const url = `http://api.positionstack.com/v1/forward`;

  try {
    const response = await axios.get(url, {
      params: {
        access_key: apiKey,
        query: input,
        limit: 5, // Limit results for autocomplete-like behavior
      },
    });

    const { data } = response;
    if (!data || !data.data || data.data.length === 0) {
      throw new Error("No suggestions found for the given input.");
    }
    console.log("data", data.data);
    // Extract suggestions
    const suggestions = data.data.map((location) => ({
      label: location.label,
      latitude: location.latitude,
      longitude: location.longitude,
    }));

    return suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error.message || error);
    throw error;
  }
};
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  // radius in km

  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371],
      },
    },
  });

  return captains;
};
