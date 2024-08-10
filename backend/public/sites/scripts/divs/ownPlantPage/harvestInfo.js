import { toggleVisibility } from "../../utils/utils.js";

export function updateHarvestInfo(harvestWeights) {
    toggleVisibility(".harvest-info-frame", harvestWeights.length > 0);
}
