export async function checkPlantEvents(plantId) {
  try {
    const response = await fetch(`/api/events/checkPlantEvents/${plantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to check plant events");
    }

    const data = await response.json();
    return data.eventExists;
  } catch (error) {
    console.error('Error checking plant events:', error);
    return false;
  }
}
