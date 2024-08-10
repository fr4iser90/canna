import { fetchOwnPlants } from "../fetch/fetchOwnPlants.js";
import { initializeOwnPlantsContainer } from "../init/initializeOwnPlantsContainer.js";

export async function updateOwnPlantsList() {
  const ownPlantsListContainer = document.getElementById("OwnPlantslist-Container");

  if (!ownPlantsListContainer) {
    console.error("Element mit ID OwnPlantslist-Container nicht gefunden");
    return;
  }

  try {
    const plants = await fetchOwnPlants();
    await initializeOwnPlantsContainer("OwnPlantslist-Container", plants, true);
  } catch (error) {
    console.error("Error updating own plants list:", error);
  }
}
