import { fetchWithAuth } from "../../global.js";
import { updateGrowthConditions } from "../../divs/ownPlantPage/growthConditions.js";
import { updateHarvestInfo } from "../../divs/ownPlantPage/harvestInfo.js";
import { updateImages } from "../../divs/ownPlantPage/images.js";
import { updateObservations } from "../../divs/ownPlantPage/observations.js";
import { updatePhaseEvents } from "../../divs/ownPlantPage/phaseEvents.js";
import { updateRecords } from "../../divs/ownPlantPage/records.js";
import { toggleVisibility } from "../../utils/utils.js";

export async function loadOwnPlantDetails(plantId) {
    try {
        console.log("Plant details fetched:", plantId);
        console.log("fetching plant;", plantId);
        const response = await fetchWithAuth(`/api/ownPlants/${plantId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch details for plant ID: ${plantId}`);
        }

        const plantDetails = await response.json();
        console.log("Plant details fetched:", plantDetails);

        // Funktion zum sicheren Setzen des Textinhalts eines Elements
        const setTextContent = (selector, text) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
            }
        };

        // Update the plant detail container with the fetched details
        setTextContent(".plant-name", plantDetails.name);
        setTextContent(".genetics", plantDetails.genetics);
        setTextContent(".thc", plantDetails.thc);
        setTextContent(".cbd", plantDetails.cbd);
        setTextContent(".growth-method", plantDetails.growthMethod);
        setTextContent(".flowering-type", plantDetails.floweringType);
        setTextContent(".flowering-time", plantDetails.floweringTime);
        setTextContent(".growth-environment", plantDetails.growthEnvironment);
        setTextContent(".substrate", plantDetails.substrate);
        setTextContent(".fertilizer", plantDetails.fertilizer);
        setTextContent(".seed-type", plantDetails.seedType);
        setTextContent(".plant-phase", plantDetails.plantPhase);
        setTextContent(".start-date", plantDetails.startDate);
        setTextContent(".crowns", plantDetails.crowns);
        setTextContent(".biggest-bud", plantDetails.biggestBudInGram);
        setTextContent(".harvest-yield", plantDetails.harvestYield);

        // Update Growth Conditions
        updateGrowthConditions(plantDetails.growthConditions);

        // Update Records
        updateRecords(plantDetails);

        // Update Harvest Info
        updateHarvestInfo(plantDetails.harvestWeights);

        // Update Observations
        updateObservations(plantDetails);

        // Update Phase Events
        updatePhaseEvents(plantDetails.phaseEvents);

        // Update Images
        updateImages(plantDetails.images);

        // Enable the edit and delete buttons
        const editButton = document.querySelector(".edit-plant");
        const deleteButton = document.querySelector(".delete-plant");
        if (editButton) editButton.disabled = false;
        if (deleteButton) deleteButton.disabled = false;

    } catch (error) {
        console.error("Error fetching plant details:", error);
    }
}

// Initialize the plant details section
export function InitializeOwnPlantSitePlantDetails() {
    const initializeField = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    };

    initializeField(".plant-name", "Select a plant to view details");
    initializeField(".genetics", "N/A");
    initializeField(".thc", "N/A");
    initializeField(".cbd", "N/A");
    initializeField(".growth-method", "N/A");
    initializeField(".flowering-type", "N/A");
    initializeField(".flowering-time", "N/A");
    initializeField(".growth-environment", "N/A");
    initializeField(".substrate", "N/A");
    initializeField(".fertilizer", "N/A");
    initializeField(".seed-type", "N/A");
    initializeField(".plant-phase", "N/A");
    initializeField(".start-date", "N/A");
    initializeField(".crowns", "N/A");
    initializeField(".biggest-bud", "N/A");
    initializeField(".harvest-yield", "N/A");

    toggleVisibility(".phase-events-frame", false);
    toggleVisibility(".growth-conditions-frame", false);
    toggleVisibility(".records-frame", false);
    toggleVisibility(".harvest-info-frame", false);
    toggleVisibility(".observations-frame", false);
    toggleVisibility(".images-frame", false);
}
