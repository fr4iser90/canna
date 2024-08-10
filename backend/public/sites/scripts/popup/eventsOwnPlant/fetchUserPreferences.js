import { getUserId, fetchWithAuth, configURL } from "../../global.js";

export async function fetchUserPreferences(popupContainer) {
  try {
    const userId = getUserId(); // Or however you get the userId
    const response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/preferences/${userId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user preferences");
    }

    const preferences = await response.json();
  
    // Populate the form with user preferences
    document.getElementById("germinationPhase").value =
      preferences.germinationPhase;
    document.getElementById("rootingPhase").value = preferences.rootingPhase;
    document.getElementById("seedlingPhase").value = preferences.seedlingPhase;
    document.getElementById("vegetationPhase").value =
      preferences.vegetationPhase;
    document.getElementById("bloomPhase").value = preferences.bloomPhase;
    // Add other preferences as needed
  } catch (error) {
    console.error("Error fetching user preferences:", error);
  }
}
