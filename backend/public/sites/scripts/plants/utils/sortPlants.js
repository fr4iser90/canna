import { displayOwnPlants } from "../display/displayOwnPlants.js";
import { displayPlantDetailsForCalendar } from "../display/displayPlantDetailsForCalendar.js";

export function sortPlants(criteria, plants) {
  let sortedPlants;
  switch (criteria) {
    case "name":
      sortedPlants = plants.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "plantPhase":
      sortedPlants = plants.sort((a, b) =>
        a.plantPhase.localeCompare(b.plantPhase),
      );
      break;
    case "sproutedAt":
      sortedPlants = plants.sort(
        (a, b) => new Date(a.sproutedAt) - new Date(b.sproutedAt),
      );
      break;
    default:
      sortedPlants = plants;
  }
  displayOwnPlants(sortedPlants, displayPlantDetailsForCalendar);
}
