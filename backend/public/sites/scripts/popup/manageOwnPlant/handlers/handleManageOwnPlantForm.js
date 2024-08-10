import { archivePlantHandler } from "./archivePlantHandler.js";
import { cuttingsHandler } from "./cuttingsHandler.js";
import { deletePlantHandler } from "./deletePlantHandler.js";

export function handleManageOwnPlantForm(plantId) {
    archivePlantHandler(plantId);
    cuttingsHandler(plantId);
    deletePlantHandler(plantId);
}
