import { showManageOwnPlantPopup } from "../display/showManageOwnPlantPopup.js";

document.addEventListener("DOMContentLoaded", () => {
    const plantId = document.querySelector("[data-plant-id]").dataset.plantId;
    showManageOwnPlantPopup(plantId);
});
