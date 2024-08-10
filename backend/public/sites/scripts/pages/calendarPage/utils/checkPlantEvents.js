import { fetchWithAuth,getUserId, getToken } from "../../global.js";

export async function checkPlantEvents(userId, plantId) {
    try {
      const response = await fetchWithAuth(`/api/events/checkPlantEvents/${userId}/${plantId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
      const data = await response.json();
      return data.eventExists;
    } catch (error) {
      console.error('Error checking plant events:', error);
      return false;
    }
  }
  