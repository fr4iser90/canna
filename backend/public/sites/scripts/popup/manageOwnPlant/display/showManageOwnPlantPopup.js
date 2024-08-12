import { removeExistingPopup } from "../../../utils/utils.js";
import { initializeManageOwnPlantPopup } from "../init/initializeManageOwnPlantPopupInit.js";

export async function showManageOwnPlantPopup(plantId) {
    removeExistingPopup("manageOwnPlantPopup");

    try {
        const response = await fetch(`/popup/manage-plant/${plantId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch popup content. Status: ${response.status}`);
        }

        const html = await response.text();
        const popupContainer = document.createElement("div");
        popupContainer.id = "manageOwnPlantPopup";
        popupContainer.innerHTML = html;
        document.body.appendChild(popupContainer);

        initializeManageOwnPlantPopup(plantId);
    } catch (error) {
        console.error("Error fetching popup content:", error);
        alert("An error occurred while fetching the popup content.");
    }
}
