import { toggleVisibility } from "../../utils/utils.js";

export function updateObservations(plantDetails) {
    const setTextContent = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    };

    if (plantDetails.diseases || plantDetails.growthTechniques || plantDetails.additionalObservations || plantDetails.earlyDeathDescription) {
        setTextContent(".diseases", plantDetails.diseases || "N/A");
        setTextContent(".growth-techniques", plantDetails.growthTechniques || "N/A");
        setTextContent(".additional-observations", plantDetails.additionalObservations || "N/A");
        setTextContent(".early-death", plantDetails.earlyDeathDescription || "N/A");
        toggleVisibility(".observations-frame", true);
    } else {
        toggleVisibility(".observations-frame", false);
    }
}
