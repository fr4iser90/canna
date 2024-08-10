export function updateSeedCuttingForm(plantType, popupContainer) {
    const sproutedLabel = popupContainer.querySelector("#sproutedLabel");
    const germinationLabel = popupContainer.querySelector("#germinationLabel");
    const rootingLabel = popupContainer.querySelector("#rootingLabel");
    const seedlingLabel = popupContainer.querySelector("#seedlingLabel");
    const vegetationLabel = popupContainer.querySelector("#vegetationLabel");
    const bloomLabel = popupContainer.querySelector("#bloomLabel");
    const germinationPhase = popupContainer.querySelector("#germinationPhase");
    const rootingPhase = popupContainer.querySelector("#rootingPhase");
    const seedlingPhase = popupContainer.querySelector("#seedlingPhase");
    const vegetationPhase = popupContainer.querySelector("#vegetationPhase");
    const bloomPhase = popupContainer.querySelector("#bloomPhase");
  
    if (plantType === "seed") {
      sproutedLabel.innerText = "Sprouted Date:";
      germinationLabel.style.display = "";
      germinationPhase.style.display = "";
      seedlingLabel.style.display = "";
      seedlingPhase.style.display = "";
      rootingLabel.style.display = "none";
      rootingPhase.style.display = "none";
    } else if (plantType === "cutting") {
      sproutedLabel.innerText = "Cutting Propagation Date:";
      germinationLabel.style.display = "none";
      germinationPhase.style.display = "none";
      seedlingLabel.style.display = "none";
      seedlingPhase.style.display = "none";
      rootingLabel.style.display = "";
      rootingPhase.style.display = "";
    }
  }
  