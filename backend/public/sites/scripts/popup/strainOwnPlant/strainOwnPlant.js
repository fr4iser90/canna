import { removeExistingPopup } from "../../utils/utils.js";
import { getToken, fetchWithAuth } from "../../global.js";
import { initializeStrainOwnPlantPopup } from "./initializeStrainOwnPlantPopup.js";

export async function showStrainOwnPlantPopup(strainId, onSave) {
  try {
      const token = getToken();

    const response = await fetchWithAuth(`/popup/strainOwnPlantPopup?strainId=${strainId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const html = await response.text();
    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.innerHTML = html;

    document.body.appendChild(popupContainer);

    initializeStrainOwnPlantPopup(strainId, onSave);
  } catch (error) {
    console.error("Error showing strain own plant popup:", error);
  }
}
