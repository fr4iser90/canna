import { removeExistingPopup } from "../../utils/utils.js";
import { getToken, fetchWithAuth } from "../../global.js";
import { initializePlantEventPopup } from "./initializePlantEventPopup.js";
import { fetchOwnPlantsById } from "../../plants/fetch/fetchOwnPlants.js";
import { fetchUserPreferences } from "../recordOwnPlant/fetchUserPreferences.js";

export async function showEventsOwnPlantPopup(eventData, droppedDate, callback) {
  try {
      const token = getToken();

    const response = await fetchWithAuth(`/popup/plantEventPopup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Network response was not ok. Status:", response.status);
      throw new Error("Network response was not ok");
    }

    const html = await response.text();
  
    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.innerHTML = html;
    document.body.appendChild(popupContainer);
  
    const startDateInput = popupContainer.querySelector("#startDate");
    if (startDateInput) {
      const dateStr = droppedDate.toISOString().substring(0, 10); // Format as yyyy-mm-dd
      startDateInput.value = dateStr;
      }

      await fetchUserPreferences(popupContainer);
  
  
    initializePlantEventPopup(popupContainer, eventData, droppedDate, callback);
  } catch (error) {
    console.error("Error showing plant event popup:", error);
  }
}

window.showEventsOwnPlantPopup = showEventsOwnPlantPopup;