import { getOwnPlantsData } from "../finalize/finalizeOwnPlantsContainer.js";

export function loadOwnPlantDetails(plantId) {
  const plantsData = getOwnPlantsData();
  const plantDetails = plantsData.find(plant => plant._id === plantId);

  if (plantDetails) {
    displayOwnPlantDetails(plantDetails);
  } else {
    console.error("Plant details not found for plantId:", plantId);
  }
}

function displayOwnPlantDetails(plant) {
  document.querySelector(".plant-name").textContent = plant.name;
  document.querySelector(".genetics").textContent = plant.genetics;
  document.querySelector(".thc").textContent = plant.thc;
  document.querySelector(".cbd").textContent = plant.cbd;
  document.querySelector(".growth-method").textContent = plant.growthMethod;
  document.querySelector(".flowering-type").textContent = plant.floweringType;
  document.querySelector(".flowering-time").textContent = plant.floweringTime;
  document.querySelector(".growth-environment").textContent = plant.growthEnvironment;
  document.querySelector(".substrate").textContent = plant.substrate;
  document.querySelector(".fertilizer").textContent = plant.fertilizer;
  document.querySelector(".seed-type").textContent = plant.seedType;

  // Add other details similarly
}
