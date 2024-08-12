import { configURL } from "../../../global.js";
import { fetchOwnPlants } from "../../../plants/fetch/fetchOwnPlants.js";

export function cuttingsHandler(plantId) {
    document.getElementById("submitCuttingButton").addEventListener("click", async () => {
        const motherPlantId = plantId;
        const numberOfCuttings = document.getElementById("numberOfCuttings").value;

        try {
            const response = await fetch(`${configURL.API_BASE_URL}/api/ownPlants/cuttings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    motherPlantId,
                    numberOfCuttings,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Cuttings created:", data);

                const modal = document.getElementById("motherPlantDialog");
                modal.classList.remove("hidden");
                modal.style.display = 'block';

                document.getElementById("stayInVegetationButton").addEventListener("click", async () => {
                    const transitionResponse = await fetch(`${configURL.API_BASE_URL}/api/ownPlants/transitionPhase`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            plantId: motherPlantId,
                            newPhase: "vegetation",
                        }),
                    });

                    if (transitionResponse.ok) {
                        // Handle success
                    } else {
                        console.error("Error transitioning plant phase:", await transitionResponse.json());
                    }

                    modal.classList.add("hidden");
                    modal.style.display = 'none';
                    fetchOwnPlants();
                    document.getElementById("manageOwnPlantPopup").remove();
                });

                document.getElementById("continueToHarvestButton").addEventListener("click", () => {
                    modal.classList.add("hidden");
                    modal.style.display = 'none';
                    fetchOwnPlants();
                    document.getElementById("manageOwnPlantPopup").remove();
                });

                document.getElementById("closeMotherPlantDialog").addEventListener("click", () => {
                    modal.classList.add("hidden");
                    modal.style.display = 'none';
                    fetchOwnPlants();
                });

            } else {
                console.error("Error creating cuttings:", await response.json());
            }
        } catch (error) {
            console.error("Error creating cuttings:", error);
        }
    });
}
