/**
 * Utility for handling browser Geolocation and Reverse Geocoding
 */

export interface DetectedAddress {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Gets the user's current coordinates using the browser's Geolocation API.
 */
export const getCurrentCoordinates = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        // Fallback: If High Accuracy times out or is unavailable, try one more time with low accuracy
        if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            },
            (err) => {
              reject(new Error("Location request timed out. Please try entering your address manually."));
            },
            { enableHighAccuracy: false, timeout: 5000 }
          );
        } else {
          let message = "An unknown error occurred while getting location.";
          if (error.code === error.PERMISSION_DENIED) {
            message = "Location access denied. Please enable permissions or enter address manually.";
          }
          reject(new Error(message));
        }
      },
      options
    );
  });
};

/**
 * Performs reverse geocoding using OpenStreetMap Nominatim API (Free).
 * In a production app, you might want to use Google Maps Geocoding API.
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<DetectedAddress> => {
  // Nominatim is free but requires a valid User-Agent
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
    {
      headers: {
        "User-Agent": "ShuddhamWellnessApp/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch address details from geocoding service.");
  }

  const data = await response.json();
  const address = data.address || {};

  // Map Nominatim fields to our internal Address structure
  // Note: Nominatim precision varies; you might want to combine several fields for line1
  return {
    line1: [
      address.house_number,
      address.road,
      address.neighbourhood,
      address.suburb,
    ]
      .filter(Boolean)
      .join(", "),
    city: address.city || address.town || address.village || address.district || "",
    state: address.state || "",
    postalCode: address.postcode || "",
    country: address.country || "India",
  };
};
