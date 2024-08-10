import { loadOwnPlantDetails } from "../plantDetails/ownPlantDetails.js";

export function setupPlantClickListener() {
  const plantsListContainer = document.getElementById("OwnPlantslist-Container");
  
  plantsListContainer.addEventListener("click", function(event) {
    const plantElement = event.target.closest(".plant");
    if (plantElement) {
      const plantId = plantElement.dataset.plantId;
      loadOwnPlantDetails(plantId);
    }
  });
}

