import { removeExistingPopup } from "../../utils/utils.js";
import { initializeStrainOwnPlantPopup } from "./initializeStrainOwnPlantPopup.js";

export async function showStrainOwnPlantPopup(strainId, onSave) {
  try {
    const response = await fetchWithCookies(`/popup/strainOwnPlantPopup?strainId=${strainId}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const html = await response.text();
    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.innerHTML = html;

    // Entferne vorhandene Popups, bevor ein neues hinzugefügt wird
    removeExistingPopup();
    
    document.body.appendChild(popupContainer);

    initializeStrainOwnPlantPopup(strainId, onSave);
  } catch (error) {
    console.error("Error showing strain own plant popup:", error);
  }
}
