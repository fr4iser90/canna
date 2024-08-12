document.addEventListener("DOMContentLoaded", () => {
  
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");
  const confirmArchiveButton = document.getElementById("confirmArchiveButton");
  const cancelButton = document.getElementById("cancelButton");
  const switchToDeleteFormButton = document.getElementById("switchToDeleteFormButton");

  const archiveForm = document.getElementById("archiveForm");
  const deleteForm = document.getElementById("deleteForm");

  const archiveReasonRadios = document.querySelectorAll('input[name="archiveReason"]');
  const diseaseOptions = document.getElementById("diseaseOptions");
  const malnutritionOptions = document.getElementById("malnutritionOptions");

  archiveReasonRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "diseases") {
        diseaseOptions.classList.remove("hidden");
        malnutritionOptions.classList.add("hidden");
      } else if (radio.value === "malnutrition") {
        diseaseOptions.classList.add("hidden");
        malnutritionOptions.classList.remove("hidden");
      } else {
        diseaseOptions.classList.add("hidden");
        malnutritionOptions.classList.add("hidden");
      }
    });
  });

  switchToDeleteFormButton.addEventListener("click", () => {
    archiveForm.classList.add("hidden");
    deleteForm.classList.remove("hidden");
  });

  cancelButton.addEventListener("click", () => {
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer) {
      popupContainer.remove();
    }
  });

  confirmDeleteButton.addEventListener("click", async () => {
    const plantId = document.querySelector("[data-plant-id]").dataset.plantId;
    const plantName = document.getElementById("confirmDeleteName").value;
    if (plantName !== document.querySelector("[data-plant-id]").dataset.plantName) {
      alert("Plant name does not match. Deletion cancelled.");
      return;
    }
    try {
      const response = await fetchWithCookies(`/api/ownPlants/${plantId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete plant");
      }

      alert("Plant deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting plant:", error);
      alert("An error occurred while deleting the plant.");
    }
  });

  confirmArchiveButton.addEventListener("click", async () => {
    const plantId = document.querySelector("[data-plant-id]").dataset.plantId;
    const yieldAmount = document.getElementById("archiveYield").value;
    const reason = document.querySelector('input[name="archiveReason"]:checked')?.value || null;
    const diseaseType = document.getElementById("diseaseType")?.value || null;
    const malnutritionType = document.getElementById("malnutritionType")?.value || null;
    const additionalNotes = document.getElementById("additionalNotes").value;

    const payload = {
      yield: yieldAmount,
      reason: reason,
      diseaseType: diseaseType,
      malnutritionType: malnutritionType,
      notes: additionalNotes,
    };

    try {
      const response = await fetchWithCookies(`/api/ownPlants/archive/${plantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to archive plant");
      }

      alert("Plant archived successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error archiving plant:", error);
      alert("An error occurred while archiving the plant.");
    }
  });
});
