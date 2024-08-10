import { fetchWithAuth, configURL } from "../../global.js";

export async function addRecord(plantId, recordType, recordData) {
  const response = await fetchWithAuth(
    `${configURL.API_BASE_URL}/api/ownPlants/${plantId}/${recordType}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordData),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `HTTP error! Status: ${response.status}`,
    );
  }
  return await response.json();
}
