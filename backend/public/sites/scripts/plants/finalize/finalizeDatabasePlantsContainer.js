import { initializeDatabasePlantsContainer } from "../init/initializeDatabasePlantsContainer.js";
import { fetchDatabasePlants } from "../fetch/fetchDatabasePlants.js";

let databasePlantsData = [];

export async function finalizeDatabasePlantsContainer() {
  try {
    // Holt die Daten der Pflanzen aus der Datenbank ohne den Access Token, da dieser nicht benötigt wird
    databasePlantsData = await fetchDatabasePlants();
    
    await initializeDatabasePlantsContainer("DatabasePlantsList-Container", databasePlantsData);
    
  } catch (err) {
    console.error("Error loading database plants:", err);
  }
}

export function getDatabasePlantsData() {
  return databasePlantsData;
}
