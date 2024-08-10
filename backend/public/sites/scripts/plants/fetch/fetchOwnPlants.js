import { configURL, fetchWithAuth, getToken, getCookies } from "../../global.js";

export async function fetchOwnPlants() {
  try {
    const token = getToken();
    const response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/ownPlants`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(
        `HTTP error! Status: ${response.status} - ${JSON.stringify(
          responseData,
        )}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching plants:", error);
    throw error;
  }
}

export async function fetchOwnPlantsById(plantId) {
  try {
    const token = getToken();
    const response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/ownPlants/${plantId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(
        `HTTP error! Status: ${response.status} - ${JSON.stringify(responseData)}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    throw error;
  }
}