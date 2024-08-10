import { showRecordPopup } from "../popup/recordOwnPlant/showRecordPopup.js";

window.showRecordPopup = showRecordPopup;

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".closeBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(document.getElementById("popupContainer"));
    });
  }

  const recordTypeSelect = document.getElementById("recordType");
  if (recordTypeSelect) {
    recordTypeSelect.addEventListener("change", updateRecordFormContent);
  }
});
