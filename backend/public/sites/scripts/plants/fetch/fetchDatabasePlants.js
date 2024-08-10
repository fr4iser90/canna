import { configURL, fetchWithAuth } from "../../global.js";

export async function fetchDatabasePlants() {
  try {
    const token = getToken();
    const response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/templatePlantDatabase`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    console.error("Error fetching database plants:", error);
    throw error;
  }
}