require("dotenv").config();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinate = async (address) => {
  try {
    // Construct the URL with API key and address
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      address
    )}&apiKey=${apiKey}`;

    // Make the API request
    const response = await axios.get(url);

    // Extract data
    const results = response?.data?.features;
    if (!results || results.length === 0) {
      throw new Error("No results found for the given address.");
    }

    // Extract latitude and longitude from the first result
    const { lat: ltd, lon: lng } = results[0]?.properties;
    return { ltd, lng };
  } catch (error) {
    console.error(
      "Error fetching coordinates:",
      error.message || error.response?.data || error
    );
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  // console.log("Origin:", origin);
  // console.log("Destination:", destination);

  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  try {
    // Construct URLs for geocoding origin and destination
    const url1 = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      origin
    )}&apiKey=${apiKey}`;
    const url2 = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      destination
    )}&apiKey=${apiKey}`;

    // Fetch coordinates for origin and destination
    const [originResponse, destinationResponse] = await Promise.all([
      axios.get(url1),
      axios.get(url2),
    ]);

    // Extract coordinates
    const originData = originResponse.data?.features?.[0]?.properties;
    const destinationData = destinationResponse.data?.features?.[0]?.properties;
    if (!originData || !destinationData) {
      throw new Error("Unable to fetch coordinates for the given locations.");
    }

    const originCoordinates = {
      lat: originData.lat,
      lng: originData.lon,
    };

    const destinationCoordinates = {
      lat: destinationData.lat,
      lng: destinationData.lon,
    };

    // Calculate distance using the Haversine formula
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
    const averageSpeedKmH = 60; // Speed in km/h
    const time = distance / averageSpeedKmH; // Time in hours

    return {
      distance: (distance * 1000).toFixed(2), // Distance in meters
      duration: (time * 60).toFixed(2), // Duration in minutes
    };
  } catch (error) {
    console.error(
      "Error calculating distance and time:",
      error.message || error
    );
    throw error;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Input text is required");
  }

  console.log("Input:", input);

  const url = `https://api.geoapify.com/v1/geocode/autocomplete`;

  try {
    const response = await axios.get(url, {
      params: {
        text: input,
        apiKey: apiKey,
        limit: 5, // Limit results for autocomplete suggestions
      },
    });

    const { features } = response.data;
    if (!features || features.length === 0) {
      throw new Error("No suggestions found for the given input.");
    }

    // console.log("Features:", features);

    // Extract suggestions
    const suggestions = features.map((feature) => ({
      label: feature.properties.formatted, // Use formatted address
      latitude: feature.properties.lat, // Latitude
      longitude: feature.properties.lon, // Longitude
    }));

    return suggestions;
  } catch (error) {
    console.error(
      "Error fetching autocomplete suggestions:",
      error.message || error
    );
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
