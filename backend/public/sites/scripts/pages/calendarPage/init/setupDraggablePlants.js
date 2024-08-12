export function setupDraggablePlants() {
  const containerEl = document.getElementById("OwnPlantslist-Container");

  if (containerEl) {
    new FullCalendar.Draggable(containerEl, {
      itemSelector: ".plant-item",
      eventData: function (eventEl) {
        return {
          title: eventEl.innerText.trim(),
          extendedProps: {
            plantId: eventEl.dataset.plantId,
          },
        };
      },
    });

    containerEl.addEventListener("dragstart", (event) => {
      if (event.target.classList.contains("plant-item")) {
        const eventData = {
          title: event.target.innerText.trim(),
          extendedProps: {
            plantId: event.target.dataset.plantId,
          },
        };
        event.dataTransfer.setData(
          "application/json",
          JSON.stringify(eventData),
        );
      }
    });
  } else {
    console.error("Element mit ID OwnPlantslist-Container nicht gefunden");
  }
}
