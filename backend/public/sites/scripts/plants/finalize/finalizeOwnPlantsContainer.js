import { initializeOwnPlantsContainer } from "../init/initializeOwnPlantsContainer.js";
import { fetchOwnPlants } from "../fetch/fetchOwnPlants.js";
import { getToken } from "../../global.js";

export async function finalizeOwnPlantsContainer(addDetailsClick = true) {
    
  const token = getToken(); // Retrieve token from cookies or storage
  if (!token) {
    console.error("Token not found");
    window.location.href = "/login"; // Redirect to login if token not found
    return;
  }

  try {
      const plants = await fetchOwnPlants(token);
      
      await initializeOwnPlantsContainer("OwnPlantslist-Container", plants, addDetailsClick);
    
    } catch (err) {
    console.error("Error loading own plants:", err);
  }
}

export function getOwnPlantsData() {
  return plants;
}