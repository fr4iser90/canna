export async function fetchDatabasePlants() {
  try {
    const response = await fetchWithCookies(`/api/templatePlantDatabase`,{
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

    const data = await response.json();
    console.log("Fetched database plants:", data);
    return data;
  } catch (error) {
    console.error("Error fetching database plants:", error);
    throw error;
  }
}
