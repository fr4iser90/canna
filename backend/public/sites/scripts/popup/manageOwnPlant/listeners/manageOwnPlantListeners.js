import { toggleForms } from "../../../utils/utils.js";
import { addClickListenerToButton, addChangeListenerToRadios } from "../../../utils/utils.js";

export function setupManageOwnPlantListeners() {
    const makeCuttingForm = document.getElementById("makeCuttingForm");
    const addRecordForm = document.getElementById("addRecordForm");
    const changePhaseForm = document.getElementById("changePhaseForm");
    const archivePlantForm = document.getElementById("archivePlantForm");
    const deletePlantForm = document.getElementById("deletePlantForm");

    if (!makeCuttingForm || !addRecordForm || !changePhaseForm || !archivePlantForm || !deletePlantForm) {
        console.error("One or more forms are not found in the DOM");
        return;
    }

    addClickListenerToButton("#makeCuttingButton", () => {
        toggleForms(makeCuttingForm, [addRecordForm, changePhaseForm, archivePlantForm, deletePlantForm]);
    });

    addClickListenerToButton("#addRecordButton", () => {
        toggleForms(addRecordForm, [makeCuttingForm, changePhaseForm, archivePlantForm, deletePlantForm]);
    });

    addClickListenerToButton("#changePhaseButton", () => {
        toggleForms(changePhaseForm, [makeCuttingForm, addRecordForm, archivePlantForm, deletePlantForm]);
    });

    addClickListenerToButton("#archivePlantButton", () => {
        toggleForms(archivePlantForm, [makeCuttingForm, addRecordForm, changePhaseForm, deletePlantForm]);
    });

    addClickListenerToButton("#deletePlantButton", () => {
        toggleForms(deletePlantForm, [makeCuttingForm, addRecordForm, changePhaseForm, archivePlantForm]);
    });

    addChangeListenerToRadios('input[name="archiveReason"]', [
        { value: "diseases", element: document.getElementById("diseaseOptions") },
        { value: "malnutrition", element: document.getElementById("malnutritionOptions") }
    ]);

    addClickListenerToButton("#cancelButton", () => {
        const popupContainer = document.getElementById("manageOwnPlantPopup");
        if (popupContainer) {
            popupContainer.remove();
        }
    });
}
