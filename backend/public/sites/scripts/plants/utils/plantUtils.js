import { toggleDetails } from "./toggleDetails.js";
import { archivePlant } from "../handlers/popupHandler.js";
import { generatePlantHtml, generatePlantDetailsHtml, generateStrainHtml, generateStrainDetailsHtml } from "../htmlGenerators/htmlGenerators.js";
import { showManageOwnPlantPopup } from "../../popup/manageOwnPlant/display/showManageOwnPlantPopup.js";
import { checkPlantEvents } from "../../calendar/utils/checkPlantEvents.js";

export function createPlantElement(plant, addDetailsClick) {
  const div = document.createElement("div");
  div.classList.add("plant");
  div.dataset.plantId = plant._id;

  const userId = getUserId();

   // Draggability based on plant phase
   if (plant.plantPhase === 'not_set') {
    div.draggable = true;
    div.addEventListener("dragstart", handleDragStart);
    div.addEventListener("dragend", handleDragEnd);
  }

  div.innerHTML = generatePlantHtml(plant);

  if (addDetailsClick) {
    div.addEventListener("click", () => {
      const detailsHtml = generatePlantDetailsHtml(plant);
      toggleDetails(div, detailsHtml, "plant-details");

      // Archive button event listener
      const archiveButton = div.querySelector("#archiveButton");
      if (archiveButton) {
        archiveButton.addEventListener("click", () => {
          archivePlant(plant._id);
        });
      }

      // Manage button event listener
      const manageButton = div.querySelector("#manageButton");
      if (manageButton) {
        manageButton.addEventListener("click", () => {
          showManageOwnPlantPopup(plant._id);
        });
      }
    });
  }

  return div;
}

export function createDatabasePlantElement(strain) {
  const div = document.createElement("div");
  div.classList.add("strain");
  div.draggable = true;
  div.addEventListener("dragstart", handleDragStart);
  div.addEventListener("dragend", handleDragEnd);
  div.innerHTML = generateStrainHtml(strain);

  div.addEventListener("click", () => {
    const detailsHtml = generateStrainDetailsHtml(strain);
    toggleDetails(div, detailsHtml, "strain-details");
  });

  return div;
}

function handleDragStart(e) {
  const eventData = {
    title: e.target.querySelector("h3").innerText,
    extendedProps: {
      plantId: e.target.dataset.plantId,
    },
  };
  e.dataTransfer.setData("application/json", JSON.stringify(eventData));
  e.target.classList.add("dragging");
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
}
