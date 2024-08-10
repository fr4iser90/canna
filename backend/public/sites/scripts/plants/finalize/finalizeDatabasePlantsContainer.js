import { initializeDatabasePlantsContainer } from "../init/initializeDatabasePlantsContainer.js";
import { fetchDatabasePlants } from "../fetch/fetchDatabasePlants.js";
import { getToken } from "../../global.js";

let databasePlantsData = [];

export async function finalizeDatabasePlantsContainer() {
    
  const token = getToken(); // Retrieve token from cookies or storage
  if (!token) {
    console.error("Token not found");
    window.location.href = "/login"; // Redirect to login if token not found
    return;
  }

  try {
      databasePlantsData = await fetchDatabasePlants(token);
      
      await initializeDatabasePlantsContainer("DatabasePlantsList-Container", databasePlantsData);
    
    } catch (err) {
    console.error("Error loading database plants:", err);
  }
}

export function getDatabasePlantsData() {
  return databasePlantsData;
}
