import { finalizeOwnPlantsContainer } from "../plants/finalize/finalizeOwnPlantsContainer.js";
import { setupPlantClickListener } from "../plants/listeners/ownPlantClickListener.js";
import { InitializeOwnPlantSitePlantDetails } from "../plants/plantDetails/ownPlantDetailsOwnPlantPage.js"

document.addEventListener("DOMContentLoaded", async function () {

  const loadArchivedPlantsSwitch = document.getElementById('loadArchivedPlants');

  loadArchivedPlantsSwitch.addEventListener('change', function() {
    if (this.checked) {
      // Load archived plants logic
      console.log("Loading archived plants...");
    } else {
      // Load active plants logic
      console.log("Loading active plants...");
    }
  });
  // Call with addDetailsClick = false
  await finalizeOwnPlantsContainer(false);
  await InitializeOwnPlantSitePlantDetails();
  setupPlantClickListener();
});
