import { updateOwnPlants } from "../../plants/update/updateOwnPlants.js";
import { formatDate } from "../../global.js";
import { createEvent } from "../../calendar/controllers/eventsController.js";

export async function handlePlantEventForm(
  popupContainer,
  eventData,
  droppedDate,
  callback,
) {
  const plantTypeElement = document.getElementById("plantType");
  const startDateElement = document.getElementById("startDate");
  const germinationElement = document.getElementById("germinationPhase");
  const rootingElement = document.getElementById("rootingPhase");
  const seedlingElement = document.getElementById("seedlingPhase");
  const vegetationElement = document.getElementById("vegetationPhase");
  const bloomElement = document.getElementById("bloomPhase");

  if (!plantTypeElement || !startDateElement) {
    console.error("Required form elements are missing");
    return;
  }

  const plantData = {
    growthMethod: plantTypeElement.value,
    startDate: startDateElement.value || formatDate(droppedDate), // Ensure the start date is set
    plantPhase: plantTypeElement.value === "seed" ? "germination" : "rooting", // Set phase based on growthMethod
    phaseDurations: {
      germination: germinationElement ? parseInt(germinationElement.value) : 0,
      rooting: rootingElement ? parseInt(rootingElement.value) : 0,
      seedling: seedlingElement ? parseInt(seedlingElement.value) : 0,
      vegetation: vegetationElement ? parseInt(vegetationElement.value) : 0,
      bloom: bloomElement ? parseInt(bloomElement.value) : 0,
    }
  };

  // Phase aktualisieren bevor die Events erstellt werden
  const updatedPlant = await updateOwnPlants(eventData.extendedProps.plantId, plantData);
  if (!updatedPlant) {
    console.error("Failed to update plant phase");
    return;
  }

  const newEvent = {
    title: eventData.title || "Default Title",
    start: formatDate(plantData.startDate || droppedDate),
    end: null,
    extendedProps: { ...eventData.extendedProps, ...plantData },
  };

  try {
    const createdEvent = await createEvent(
      eventData.extendedProps.plantId,
      newEvent,
    );
    if (!createdEvent) {
      console.error("Failed to create plant event.");
      alert("Error: Unknown error");
    }
  } catch (error) {
    console.error("Error handling plant event drop:", error);
    if (error.response) {
      if (
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.message === "Events for this plant already exist"
      ) {
        alert("Pflanze schon im Kalender eingetragen");
      } else if (
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert(`Error: ${error.message || "Unknown error"}`);
      }
    } else {
      alert(`Error: ${error.message || "Unknown error"}`);
    }
  }

  document.body.removeChild(popupContainer);
  if (typeof callback === "function") {
    callback(plantData);
  } else {
    console.error("Callback is not a function");
  }
}
