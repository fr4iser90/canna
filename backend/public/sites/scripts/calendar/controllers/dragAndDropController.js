import { showEventsOwnPlantPopup } from "../../popup/eventsOwnPlant/eventsOwnPlant.js";
import { updateCalendar } from "../utils/updateCalendar.js";
import { checkPlantEvents } from "../utils/checkPlantEvents.js";
import { updateOwnPlantsList } from "../../plants/update/updateOwnPlantsList.js";

export async function initializeDragAndDrop(calendar) {
  const ownPlantsListContainer = document.getElementById("OwnPlantslist-Container");
  const calendarEl = document.getElementById("calendar");

  if (!ownPlantsListContainer) {
    console.error("Element mit ID OwnPlantslist-Container nicht gefunden");
    return;
  }

  if (!calendarEl) {
    console.error("Kalender-Element nicht gefunden");
    return;
  }

  new FullCalendar.Draggable(ownPlantsListContainer, {
    itemSelector: ".plant-item",
    eventData: function (eventEl) {
      const eventData = {
        title: eventEl.innerText.trim(),
        extendedProps: {
          plantId: eventEl.dataset.plantId,
        },
      };
      return eventData;
    },
  });

  ownPlantsListContainer.addEventListener("dragstart", (event) => {
    if (event.target.classList.contains("plant-item")) {
      const eventData = {
        title: event.target.innerText.trim(),
        extendedProps: {
          plantId: event.target.dataset.plantId,
        },
      };
      event.dataTransfer.setData("application/json", JSON.stringify(eventData));
      event.target.classList.add("dragging");
    }
  });

  ownPlantsListContainer.addEventListener("dragend", (event) => {
    if (event.target.classList.contains("plant-item")) {
      event.target.classList.remove("dragging");
    }
  });

  calendarEl.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  calendarEl.addEventListener("drop", async (event) => {
    event.preventDefault();

    const data = event.dataTransfer.getData("application/json");

    if (!data) {
      console.error("No data received during drop event");
      return;
    }

    let eventData;
    try {
      eventData = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing event data:", error);
      return;
    }

    const targetDateCell = event.target.closest(".fc-day, .fc-daygrid-day");
    if (!targetDateCell) {
      console.error("Drop target is not a valid date cell.");
      return;
    }

    const droppedDate = new Date(targetDateCell.getAttribute("data-date"));
    if (isNaN(droppedDate)) {
      console.error("Invalid date detected:", targetDateCell.getAttribute("data-date"));
      return;
    }

    const plantId = eventData.extendedProps.plantId;

    // Da die Benutzer-ID nun serverseitig verarbeitet wird, muss diese nicht mehr im Frontend verwendet werden.
    const eventExists = await checkPlantEvents(plantId);
    console.log(eventExists);
    if (eventExists) {
      alert('Events for this plant already exist.');
      return;
    }

    // Show the popup
    showEventsOwnPlantPopup(eventData, droppedDate, async (plantData) => {
      // Kalender und Pflanzenliste aktualisieren
      updateCalendar(calendar);
      await updateOwnPlantsList();
    });
  });
}
