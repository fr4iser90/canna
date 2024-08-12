export function archivePlantHandler(plantId) {
    document.getElementById("confirmArchiveButton").addEventListener("click", async () => {
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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to archive plant");
            }

            const plantElement = document.querySelector(`[data-plant-id="${plantId}"]`);
            if (plantElement) {
                plantElement.remove();
            }
            document.getElementById("manageOwnPlantPopup").remove();
        } catch (error) {
            console.error("Error archiving plant:", error);
        }
    });
}
