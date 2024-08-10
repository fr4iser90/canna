import { loadOwnPlants } from "../loadOwnPlants.js";

document.addEventListener("DOMContentLoaded", async function () {
  await checkTokenAndRedirect();
  await loadOwnPlants();
  });
