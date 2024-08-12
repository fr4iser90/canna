import { showStrainOwnPlantPopup } from "../popup/strainOwnPlant/strainOwnPlant.js";
import { finalizeOwnPlantsContainer } from "../plants/finalize/finalizeOwnPlantsContainer.js";

export function handleDragStart(e) {
    if (e.target && e.target.classList.contains("strain")) {
        const strainId = e.target.dataset.strainId;
        if (strainId) {
            const eventData = {
                title: e.target.querySelector("h3").innerText,
                extendedProps: {
                    strainId: strainId,
                },
            };
            e.dataTransfer.setData("application/json", JSON.stringify(eventData));
            e.target.classList.add("dragging");
        } else {
            console.error("strainId is undefined or null.");
        }
    } else {
        console.error("Drag start event target does not have class 'strain' or is null.");
    }
}

export function handleDragEnd(e) {
    if (e.target && e.target.classList.contains("strain")) {
        e.target.classList.remove("dragging");
    }
}

export function handleDragOver(e, ownPlantsList) {
    e.preventDefault();
    ownPlantsList.classList.add("drag-over");
}

export function handleDragLeave(ownPlantsList) {
    ownPlantsList.classList.remove("drag-over");
}

export async function handleDrop(e, ownPlantsList) {
    e.preventDefault();
    ownPlantsList.classList.remove("drag-over");

    const data = e.dataTransfer.getData("application/json");

    if (!data) {
        console.error("No data found in dataTransfer");
        return;
    }

    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return;
    }

    const { strainId } = parsedData.extendedProps;
    if (strainId) {
        await showStrainOwnPlantPopup(strainId, async (plant) => {
            await handleSavePlant(plant);
        });
    } else {
        console.error("Dropped strainId is undefined.");
    }
}

async function handleSavePlant(plant) {
    try {
        const response = await fetchWithCookies(`/api/ownPlants`, {
            method: "POST",
            body: JSON.stringify(plant),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const newPlant = await response.json();
            await finalizeOwnPlantsContainer();
        } else {
            console.error("Error adding plant:", response.statusText);
        }
    } catch (err) {
        console.error("Error adding plant:", err);
    }
}
