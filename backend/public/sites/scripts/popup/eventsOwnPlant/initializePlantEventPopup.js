import { getToken, fetchWithAuth, getUserId, formatDate } from "../../global.js";
import { fetchUserPreferences } from "../recordOwnPlant/fetchUserPreferences.js";
import { handlePlantEventForm } from "./handlePlantEventForm.js";
import { updateSeedCuttingForm } from "./updateSeedCuttingForm.js";
import { fetchOwnPlantsById } from "../../plants/fetch/fetchOwnPlants.js";

// Initialize popup function that sets up the HTML and event listeners
export async function initializePlantEventPopup(popupContainer, eventData, droppedDate, callback) {
    const closeBtn = popupContainer.querySelector(".closeBtn");
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.body.removeChild(popupContainer);
        };
    } else {
        console.error("Close button not found in the popup");
    }

    const plantId = eventData.extendedProps.plantId;
    let originalPlantType = 'seed'; // Default value

    try {
        const plantData = await fetchOwnPlantsById(plantId);
        if (plantData && plantData.growthMethod) {
            originalPlantType = plantData.growthMethod;
        }
    } catch (error) {
        console.error("Error fetching plant data:", error);
    }

    const plantTypeSelect = popupContainer.querySelector("#plantType");
    plantTypeSelect.value = originalPlantType;

    plantTypeSelect.addEventListener("change", (event) => {
        const newPlantType = event.target.value;
        if (newPlantType !== originalPlantType) {
            showConfirmationModal(originalPlantType, newPlantType, () => {
                originalPlantType = newPlantType;  // Update the original type to new type after confirmation
                updateSeedCuttingForm(newPlantType, popupContainer);
            }, () => {
                plantTypeSelect.value = originalPlantType;
            });
        } else {
            updateSeedCuttingForm(newPlantType, popupContainer);
        }
    });

    // Initialize the form based on the default selected plant type
    updateSeedCuttingForm(plantTypeSelect.value, popupContainer);

    // Handle form submission
    const saveButton = popupContainer.querySelector("#savePlantButton");
    const cancelButton = popupContainer.querySelector("#cancelPlantButton");

    if (saveButton) {
        saveButton.onclick = (e) => {
            e.preventDefault();
            handlePlantEventForm(popupContainer, eventData, droppedDate, callback);
        };
    } else {
        console.error("Save button not found in the popup");
    }

    if (cancelButton) {
        cancelButton.onclick = (e) => {
            e.preventDefault();
            document.body.removeChild(popupContainer);
        };
    } else {
        console.error("Cancel button not found in the popup");
    }
}

function showConfirmationModal(currentType, newType, onConfirm, onCancel) {
    const modal = document.getElementById("confirmationModal");
    const currentTypeSpan = document.getElementById("currentType");
    const newTypeSpan = document.getElementById("newType");

    currentTypeSpan.textContent = currentType;
    newTypeSpan.textContent = newType;

    modal.classList.remove("hidden");
    modal.classList.add("visible");
    modal.style.display = 'block'; // Ensure the modal is displayed
    const closeModal = () => {
        modal.classList.add("hidden");
        modal.classList.remove("visible");
        modal.style.display = 'none'; // Hide the modal
    };

    document.getElementById("confirmChangeButton").onclick = () => {
        closeModal();
        onConfirm();
    };

    document.getElementById("cancelChangeButton").onclick = () => {
        closeModal();
        onCancel();
    };

    document.getElementById("closeConfirmationModal").onclick = closeModal;
}

window.initializePlantEventPopup = initializePlantEventPopup;
