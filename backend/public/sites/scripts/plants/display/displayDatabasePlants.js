import { createDatabasePlantElement } from "../utils/plantUtils.js";

export function displayDatabasePlants(strains, onStrainClick) {
  const databasePlantsListContainer = document.getElementById("DatabasePlantsList-Container");
  databasePlantsListContainer.innerHTML = ""; // Clear the container

  strains.forEach((strain) => {
    const strainElement = createDatabasePlantElement(strain);
    strainElement.setAttribute("data-strain-id", strain._id);
    strainElement.addEventListener("click", () => onStrainClick(strain));
    databasePlantsListContainer.appendChild(strainElement);
  });
}

export function initializeSearchFunctionality(allStrains, onStrainClick) {
  const searchInput = document.getElementById("searchInputStrains");
  let debounceTimeout;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      const query = searchInput.value.toLowerCase();
      const filteredStrains = allStrains.filter(
        (strain) =>
          strain.name.toLowerCase().includes(query) ||
          strain.genetics.toLowerCase().includes(query)
      );
      displayDatabasePlants(filteredStrains, onStrainClick);
    }, 300); // Adjust the debounce delay as needed
  });
}
