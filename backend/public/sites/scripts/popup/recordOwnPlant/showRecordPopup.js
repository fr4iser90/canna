import { getToken } from "../../global.js";
import { initializeRecordPopup } from "./initializeRecordPopup.js";

export async function showRecordPopup(event, clickedDate) {
  try {
    const token = getToken();
    const plantId = event.extendedProps.plantId;

    // Ensure clickedDate is a valid date object
    const dateObject = new Date(clickedDate);
    if (isNaN(dateObject.getTime())) {
      console.error("Invalid clickedDate:", clickedDate);
      throw new Error("Invalid clicked date");
    }

    const recordDate = dateObject.toISOString().split("T")[0];


    const response = await fetch(
      `/popup/record?plantId=${plantId}&recordDate=${recordDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const html = await response.text();
    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.innerHTML = html;

    document.body.appendChild(popupContainer);
    initializeRecordPopup(popupContainer, plantId, recordDate);
  } catch (error) {
    console.error("Error showing record popup:", error);
  }
}
