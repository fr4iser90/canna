import { generatePlantDetailsHtml } from "../htmlGenerators/htmlGenerators";
import { createPlantElement } from "../utils/plantUtils";

let plants = [];

export function setPlantsData(plantsData) {
  plants = plantsData;
}

export function renderPlants() {
  const container = document.getElementById("OwnPlantslist-Container");
  container.innerHTML = "";
  plants.forEach(plant => {
    const plantElement = createPlantElement(plant, showPlantDetailsModal);
    container.appendChild(plantElement);
  });
}

export function sortPlants(criteria) {
  if (criteria === "name") {
    plants.sort((a, b) => a.name.localeCompare(b.name));
  } else if (criteria === "age") {
    plants.sort((a, b) => a.age - b.age);
  } else if (criteria === "motherPlant") {
    plants.sort((a, b) => b.isMotherPlant - a.isMotherPlant);
  }
  renderPlants();
}

export function searchPlants(query) {
  const container = document.getElementById("OwnPlantslist-Container");
  container.innerHTML = "";
  const filteredPlants = plants.filter(plant => plant.name.toLowerCase().includes(query.toLowerCase()));
  filteredPlants.forEach(plant => {
    const plantElement = createPlantElement(plant, showPlantDetailsModal);
    container.appendChild(plantElement);
  });
}

export function showPlantDetailsModal(plant) {
  const modal = document.getElementById("plant-details-modal");
  const detailsContainer = document.getElementById("plant-details");
  detailsContainer.innerHTML = generatePlantDetailsHtml(plant);
  modal.style.display = "block";

  const closeButton = modal.querySelector(".close");
  closeButton.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}