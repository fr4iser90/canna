import { handleManageOwnPlantForm } from "../handlers/handleManageOwnPlantForm.js";
import { setupManageOwnPlantListeners } from "../listeners/manageOwnPlantListeners.js";

export function initializeManageOwnPlantPopup(plantId) {
    setupManageOwnPlantListeners();
    handleManageOwnPlantForm(plantId);
}
