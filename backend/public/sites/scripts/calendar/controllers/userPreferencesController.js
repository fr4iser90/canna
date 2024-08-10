import { configURL, fetchWithAuth } from "../../global.js";

// Fetch user preferences from the server
export async function fetchUserPreferences(userId) {
  try {
    const response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/preferences/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const preferences = await response.json();
    return preferences;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return {
      germinationPhase: 7,
      seedlingPhase: 14,
      vegetationPhase: 28,
      bloomPhase: 56,
      growingEnvironment: "indoor",
      preferredSubstrate: "Soil",
      fertilizerType: "mineral",
      fertilizerBrand: "",
      wateringMethod: "manual",
      wateringFrequency: 3,
      lightSource: "LED",
      lightCycle: "18/6",
      temperatureRange: "20-25°C",
      humidityRange: "40-60%",
      trainingMethods: ["LST"],
      harvestMethod: "dry",
      dryingEnvironment: "20°C, 50% RH",
      curingMethod: "jars",
      useCO2: false,
      useMycorrhiza: false,
    };
  }
}

// Update user preferences on the server
export async function updateUserPreferences(userId, preferences) {
  try {
    const response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/preferences/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedPreferences = await response.json();
    return updatedPreferences;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return null;
  }
}

// Example function to display user preferences in a form
export async function displayUserPreferences(userId) {
  const preferences = await fetchUserPreferences(userId);
  if (!preferences) {
    console.error("No preferences found for user");
    return;
  }

  // Assuming you have form elements with IDs matching the preference keys
  document.getElementById("germinationPhase").value =
    preferences.germinationPhase;
  document.getElementById("seedlingPhase").value = preferences.seedlingPhase;
  document.getElementById("vegetationPhase").value =
    preferences.vegetationPhase;
  document.getElementById("bloomPhase").value = preferences.bloomPhase;
  // Add more fields as necessary
}

// Example function to handle form submission and update preferences
export async function handlePreferencesFormSubmit(event) {
  event.preventDefault();

  const userId = getUserId(); // Assuming you have a function to get the current user ID
  const preferences = {
    germinationPhase: parseInt(
      document.getElementById("germinationPhase").value,
    ),
    seedlingPhase: parseInt(document.getElementById("seedlingPhase").value),
    vegetationPhase: parseInt(document.getElementById("vegetationPhase").value),
    bloomPhase: parseInt(document.getElementById("bloomPhase").value),
    // Add more fields as necessary
  };

  const updatedPreferences = await updateUserPreferences(userId, preferences);
  if (updatedPreferences) {
    } else {
    console.error("Failed to update preferences");
  }
}
