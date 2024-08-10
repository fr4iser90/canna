import { getToken } from "../../global.js";
import { handleStrainOwnPlantForm } from "./handleStrainOwnPlantForm.js";

export async function initializeStrainOwnPlantPopup(strainId, onSave) {
  try {
    const token = getToken();

    const strainResponse = await fetch(`/api/templatePlantDatabase/${strainId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!strainResponse.ok) {
      throw new Error("Failed to fetch strain data");
    }

    const strainData = await strainResponse.json();
  
    // Populate the popup form with strain data
    document.getElementById("plantName").value = strainData.name;
    document.getElementById("plantGenetics").value = strainData.genetics;
    document.getElementById("plantTHC").value = strainData.thc;
    document.getElementById("plantCBD").value = strainData.cbd;
    document.getElementById("plantFloweringTime").value = strainData.flowering_time.split("-")[0].replace(/\D/g, "");

    handleStrainOwnPlantForm(onSave);
  } catch (error) {
    console.error("Error initializing strain own plant popup:", error);
  }
}
