import { configURL } from "../global.js";

export async function getUserPreferences() {
  try {
    const response = await fetch(
      `${configURL.API_BASE_URL}/api/preferences`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
}

export async function updateUserPreferences(preferences) {
  try {
    const response = await fetch(
      `${configURL.API_BASE_URL}/api/preferences`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("preferencesForm");
  const elements = form.elements;

  // Benutzerpräferenzen laden
  try {
    const preferences = await getUserPreferences();
    for (const key in preferences) {
      if (preferences.hasOwnProperty(key) && elements[key]) {
        if (elements[key].type === "checkbox") {
          elements[key].checked = preferences[key];
        } else {
          elements[key].value = preferences[key];
        }
      }
    }
  } catch (error) {
    console.error("Error loading user preferences:", error);
  }

  // Benutzerpräferenzen aktualisieren
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const updatedPreferences = {};
    for (const element of elements) {
      if (element.name) {
        updatedPreferences[element.name] =
          element.type === "checkbox" ? element.checked : element.value;
      }
    }

    try {
      await updateUserPreferences(updatedPreferences);
      alert("Preferences updated successfully!");
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to update preferences.");
    }
  });
});
