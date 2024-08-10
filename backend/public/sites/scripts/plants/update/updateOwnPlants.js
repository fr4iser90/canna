import { fetchWithAuth, configURL, getUserId } from "../../global.js";

export async function updateOwnPlants(plantId, plantData) {
  try {
    const userId = getUserId();
    
    if (!userId) {
      throw new Error("User ID is not defined");
    }

    plantData.userId = userId; // Ensure userId is included in the plantData

    const response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/ownPlants/${plantId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plantData),
      },
    );

  
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response data:", errorData);
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`,
      );
    }

    const updatedPlant = await response.json();
      return updatedPlant;
  } catch (error) {
    console.error("Error updating plant:", error);
    throw error;
  }
}
