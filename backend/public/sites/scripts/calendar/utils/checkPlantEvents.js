export async function checkPlantEvents(plantId) {
  try {
    const response = await fetchWithCookies(`/api/events/plant/${plantId}/check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.eventExists;
  } catch (error) {
    console.error('Error checking plant events:', error);
    return false;
  }
}
