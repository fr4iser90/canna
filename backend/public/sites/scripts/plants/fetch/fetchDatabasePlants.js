export async function fetchDatabasePlants() {
  try {
    const response = await fetch(`/api/templatePlantDatabase`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
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
