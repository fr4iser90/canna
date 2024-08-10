import {
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
  handleDrop
} from "./strainOwnPlantPopupMain.js";
import { finalizeDatabasePlantsContainer } from "../plants/finalize/finalizeDatabasePlantsContainer.js";
import { finalizeOwnPlantsContainer } from "../plants/finalize/finalizeOwnPlantsContainer.js";

document.addEventListener("DOMContentLoaded", async function () {
  
  const strainsList = document.getElementById("DatabasePlantsList-Container");
  const ownPlantsList = document.getElementById("OwnPlantslist-Container");

  await initializeContainers();

  strainsList.addEventListener("dragstart", (e) => handleDragStart(e));
  strainsList.addEventListener("dragend", (e) => handleDragEnd(e));
  ownPlantsList.addEventListener("dragover", (e) => handleDragOver(e, ownPlantsList));
  ownPlantsList.addEventListener("dragleave", () => handleDragLeave(ownPlantsList));
  ownPlantsList.addEventListener("drop", (e) => handleDrop(e, ownPlantsList));
});

async function initializeContainers() {
  try {
    await finalizeOwnPlantsContainer();
    await finalizeDatabasePlantsContainer();
    } catch (error) {
    console.error("Error initializing containers:", error);
  }
}
