import { createPlantElement } from "../utils/plantUtils.js";

export function displayOwnPlants(plants, addDetailsClick) {
  const ownPlantsListContainer = document.getElementById("OwnPlantslist-Container");
  ownPlantsListContainer.innerHTML = ""; // Clear the container

  plants.forEach((plant) => {
    const plantElement = createPlantElement(plant, addDetailsClick);
    plantElement.setAttribute("data-plant-id", plant._id);
    ownPlantsListContainer.appendChild(plantElement);
  });
}
