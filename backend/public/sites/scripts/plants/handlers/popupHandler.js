import { removeExistingPopup } from "../../utils/utils.js";
import { getToken, fetchWithAuth } from "../../global.js";

export async function archivePlant(plantId) {
    try {
        const token = getToken();
        const response = await fetch(`/api/ownPlants/archive/${plantId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to archive plant");
        }

        const result = await response.json();
          const plantElement = document.querySelector(`[data-plant-id="${plantId}"]`);
        if (plantElement) {
            plantElement.remove();
        }
    } catch (error) {
        console.error("Error archiving plant:", error);
    }
}

export async function showManagePlantPopup(plantId) {
  
    removeExistingPopup("managePlantPopup");

    try {
        const response = await fetchWithAuth(`/popup/manage-plant/${plantId}`);
        const popupHtml = await response.text();
  
        const popupContainer = document.createElement("div");
        popupContainer.id = "managePlantPopup";
        popupContainer.classList.add("popup-container");
        popupContainer.innerHTML = popupHtml;
        document.body.appendChild(popupContainer);

  
        initializePopupEventListeners(plantId);
    } catch (error) {
        console.error("Error fetching popup content:", error);
        alert("An error occurred while fetching the popup content.");
    }
}

function initializePopupEventListeners(plantId) {
    document.getElementById("confirmArchiveButton").addEventListener("click", async () => {
          const yieldAmount = document.getElementById("archiveYield").value;
        const reason = document.querySelector('input[name="archiveReason"]:checked')?.value || null;
        const diseaseType = document.getElementById("diseaseType")?.value || null;
        const malnutritionType = document.getElementById("malnutritionType")?.value || null;
        const additionalNotes = document.getElementById("additionalNotes").value;

        const payload = {
            yield: yieldAmount,
            reason: reason,
            diseaseType: diseaseType,
            malnutritionType: malnutritionType,
            notes: additionalNotes,
        };

        try {
            const token = getToken();
            const response = await fetch(`/api/ownPlants/archive/${plantId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to archive plant");
            }

            const result = await response.json();
              const plantElement = document.querySelector(`[data-plant-id="${plantId}"]`);
            if (plantElement) {
                plantElement.remove();
            }
            document.getElementById("managePlantPopup").remove();
        } catch (error) {
            console.error("Error archiving plant:", error);
        }
    });

    document.getElementById("confirmDeleteButton").addEventListener("click", async () => {
          const plantName = document.getElementById("confirmDeleteName").value;
        if (plantName !== document.querySelector(`[data-plant-id="${plantId}"]`).dataset.plantName) {
            alert("Plant name does not match. Deletion cancelled.");
            return;
        }
        try {
            const token = getToken();
            const response = await fetch(`/api/ownPlants/${plantId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete plant");
            }

            alert("Plant deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting plant:", error);
            alert("An error occurred while deleting the plant.");
        }
    });

    document.getElementById("cancelButton").addEventListener("click", () => {
        document.getElementById("managePlantPopup").remove();
    });

    const archiveReasonRadios = document.querySelectorAll('input[name="archiveReason"]');
    const diseaseOptions = document.getElementById("diseaseOptions");
    const malnutritionOptions = document.getElementById("malnutritionOptions");

    archiveReasonRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "diseases") {
                diseaseOptions.classList.remove("hidden");
                malnutritionOptions.classList.add("hidden");
            } else if (radio.value === "malnutrition") {
                diseaseOptions.classList.add("hidden");
                malnutritionOptions.classList.remove("hidden");
            } else {
                diseaseOptions.classList.add("hidden");
                malnutritionOptions.classList.add("hidden");
            }
        });
    });
}
