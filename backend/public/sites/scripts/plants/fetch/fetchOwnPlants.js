export async function fetchOwnPlants() {
  try {
    const response = await fetchWithCookies(`/api/ownPlants`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
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
    const response = await fetchWithCookies(
      `/api/ownPlants/${plantId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
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
