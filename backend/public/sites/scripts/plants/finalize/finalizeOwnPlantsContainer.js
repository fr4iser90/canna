import { initializeOwnPlantsContainer } from "../init/initializeOwnPlantsContainer.js";
import { fetchOwnPlants } from "../fetch/fetchOwnPlants.js";

let plants = []; // Globale Variable zur Speicherung der Pflanzen

export async function finalizeOwnPlantsContainer(addDetailsClick = true) {
  try {
    plants = await fetchOwnPlants(); 
    await initializeOwnPlantsContainer("OwnPlantslist-Container", plants, addDetailsClick);
  } catch (err) {
    console.error("Error loading own plants:", err);
  }
}

export function getOwnPlantsData() {
  return plants; // Gibt die Pflanzen-Daten zurück
}
