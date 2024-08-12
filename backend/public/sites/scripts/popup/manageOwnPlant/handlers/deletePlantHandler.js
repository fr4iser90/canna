export function deletePlantHandler(plantId) {
    document.getElementById("confirmDeleteButton").addEventListener("click", async () => {
        const plantNameInput = document.getElementById("confirmDeleteName").value.trim();
        const plantNameData = document.querySelector("#managePlantForm").getAttribute("data-plant-name");

        if (plantNameInput !== plantNameData) {
            alert("Plant name does not match. Deletion cancelled.");
            return;
        }

        try {
            // Delete the plant
            const deletePlantResponse = await fetchWithCookies(`/api/ownPlants/${plantId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!deletePlantResponse.ok) {
                throw new Error("Failed to delete plant");
            }

            // Delete associated events
            const deleteEventsResponse = await fetchWithCookies(`/api/events/plant/${plantId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (deleteEventsResponse.status === 404) {
                console.warn("No events found for deletion.");
                alert("Plant deleted successfully, no associated events found.");
                window.location.reload();
                return;
            }

            if (!deleteEventsResponse.ok) {
                throw new Error("Failed to delete events associated with the plant");
            }

            alert("Plant and associated events deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting plant and associated events:", error);
            alert("An error occurred while deleting the plant and associated events.");
        }
    });
}
