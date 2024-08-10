import { displayDatabasePlants, initializeSearchFunctionality } from "../display/displayDatabasePlants.js";

export async function initializeDatabasePlantsContainer(containerId, strains, onStrainClick) {
  const databasePlantsListContainer = document.getElementById(containerId);
  
  if (!databasePlantsListContainer) {
    console.error(`Database plants list container element '${containerId}' not found`);
    return;
  }

  try {
    displayDatabasePlants(strains, onStrainClick);
    initializeSearchFunctionality(strains, onStrainClick);
  } catch (err) {
    console.error("Error displaying database plants:", err);
  }
}
