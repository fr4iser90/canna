export function handleStrainOwnPlantForm(onSave) {
    const cancelButton = document.getElementById("cancelPlantButton");
    const saveButton = document.getElementById("savePlantButton");
  
    cancelButton.addEventListener("click", () => {
      document.getElementById("popupContainer").remove();
    });
  
    saveButton.addEventListener("click", () => {
      const plantData = {
        name: document.getElementById("plantName").value,
        genetics: document.getElementById("plantGenetics").value,
        thc: document.getElementById("plantTHC").value,
        cbd: document.getElementById("plantCBD").value,
        growthMethod: document.getElementById("growthMethod").value,
        flowering_time: document.getElementById("plantFloweringTime").value,
        isMotherPlant: document.getElementById("isMotherPlant").value,
      };
  
      onSave(plantData);
      document.getElementById("popupContainer").remove();
    });
  }
  