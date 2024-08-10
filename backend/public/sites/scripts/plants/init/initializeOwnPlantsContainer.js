import { displayOwnPlants } from "../display/displayOwnPlants.js";

export async function initializeOwnPlantsContainer(containerId, plants, addDetailsClick) {
  const ownPlantsListContainer = document.getElementById(containerId);
  
  if (!ownPlantsListContainer) {
    console.error(`Own plants list container element '${containerId}' not found`);
    return;
  }

  try {
    displayOwnPlants(plants, addDetailsClick);
  } catch (err) {
    console.error("Error displaying own plants:", err);
  }
}
