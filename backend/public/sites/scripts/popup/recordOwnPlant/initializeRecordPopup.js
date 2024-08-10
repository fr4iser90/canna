import { updateRecordFormContent } from "./updateRecordFormContent.js";
import { handleRecordFormSubmission } from "./handleRecordFormSubmission.js";

export function initializeRecordPopup(popupContainer, plantId, recordDate) {
  const closeBtn = popupContainer.querySelector(".closeBtn");
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(popupContainer);
  });

  const recordForm = popupContainer.querySelector("#recordForm");
  recordForm.addEventListener("submit", (e) => {
    handleRecordFormSubmission(e, plantId, recordDate);
  });

  const recordTypeSelect = document.getElementById("recordType");
  recordTypeSelect.addEventListener("change", updateRecordFormContent);

  updateRecordFormContent(); // Initialize form content based on the default record type
}
