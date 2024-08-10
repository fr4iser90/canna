import { toggleVisibility } from "../../utils/utils.js";

export function updateRecords(plantDetails) {
    const hasRecords = plantDetails.heightRecords.length > 0 || plantDetails.widthRecords.length > 0 ||
        plantDetails.waterRecords.length > 0 || plantDetails.nutrientRecords.length > 0 || plantDetails.rootDevelopment.length > 0;
    toggleVisibility(".records-frame", hasRecords);
}
