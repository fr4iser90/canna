import { toggleVisibility } from "../../utils/utils.js";

export function updateGrowthConditions(growthConditions) {
    if (growthConditions) {
        document.querySelector(".temperature").textContent = growthConditions.temperature || "N/A";
        document.querySelector(".humidity").textContent = growthConditions.humidity || "N/A";
        document.querySelector(".light-intensity").textContent = growthConditions.lightIntensity || "N/A";
        document.querySelector(".co2-level").textContent = growthConditions.co2Level || "N/A";
        document.querySelector(".ph-level").textContent = growthConditions.phLevel || "N/A";
        document.querySelector(".air-movement").textContent = growthConditions.airMovement || "N/A";
        toggleVisibility(".growth-conditions-frame", true);
    } else {
        toggleVisibility(".growth-conditions-frame", false);
    }
}
