import { initializeDragAndDrop } from "../controllers/dragAndDropController.js";
import { fetchEvents, updateEvent } from "../controllers/eventsController.js";
import { getUserId } from "../../global.js";
import { showRecordPopup } from "../../popup/recordOwnPlant/showRecordPopup.js";
import { plantDropListener } from "../listeners/listeners.js";


const getDateString = (date) => {
  return new Date(date).toISOString().split("T")[0]; // Returns only the date part (YYYY-MM-DD)
};

let calendar; // Global variable to hold the calendar instance

export async function initializeCalendar(userId) {
  const calendarEl = document.getElementById("calendar");

  if (!calendarEl) {
    console.error("Calendar element not found");
    return;
  }

  try {
    const events = await fetchEvents(userId);
    const formattedEvents = events.map((event) => ({
      ...event,
      start: getDateString(event.start),
      end: event.end ? getDateString(event.end) : null,
      allDay: true,
    }));

    if (calendar) {
      // Update the existing calendar
      calendar.removeAllEvents();
      calendar.addEventSource(formattedEvents);
      calendar.refetchEvents();
    } else {
      // Initialize a new calendar
      calendar = new FullCalendar.Calendar(calendarEl, {
        locale: "de",
        initialView: "dayGridMonth",
        editable: userId === getUserId(), // Only allow editing for the current user's calendar
        droppable: userId === getUserId(),
        events: formattedEvents,
        datesSet: function (info) {
          // Überprüfe die Anzahl der Events in einem Tag
          document.querySelectorAll('.fc-daygrid-day').forEach(day => {
            let events = day.querySelectorAll('.fc-event');
            if (events.length > 3) { // Wenn mehr als 3 Events vorhanden sind
              events.forEach(event => {
                event.classList.add('small-font'); // Kleinere Schriftgröße anwenden
              });
            }
          });
        },
        eventReceive: async (info) => {
          if (userId !== getUserId()) return;

          const plantId = info.draggedEl.getAttribute('data-plant-id');
          const eventExists = await checkPlantEvents(userId, plantId);
          console.log(eventExists);
          if (eventExists) {
            alert('Events for this plant already exist.');
            info.revert();
            return;
          }

          const eventData = {
            title: info.event.title,
            extendedProps: {
              plantId: info.event.extendedProps.plantId,
            },
          };

          const targetDateCell = info.el.closest(".fc-day, .fc-daygrid-day");
          const droppedDate = new Date(targetDateCell.getAttribute("data-date"));
          showEventsOwnPlantPopup(eventData, droppedDate, async (plantData) => {
          });
        },
        eventDrop: async (info) => {
          if (userId !== getUserId()) return;
          try {
            const updatedEvent = {
              id: info.event.id,
              title: info.event.title,
              start: getDateString(info.event.start),
              end: info.event.end ? getDateString(info.event.end) : null,
              plantId: info.event.extendedProps.plantId,
            };

            await updateEvent(userId, updatedEvent);
          } catch (error) {
            console.error("Error handling event drop:", error);
            info.revert();
          }
        },
        eventResize: async (info) => {
          if (userId !== getUserId()) return;
          try {
            const updatedEvent = {
              id: info.event.id,
              title: info.event.title,
              start: getDateString(info.event.start),
              end: info.event.end ? getDateString(info.event.end) : null,
              plantId: info.event.extendedProps.plantId,
            };
            await updateEvent(userId, updatedEvent);
          } catch (error) {
            console.error("Error handling event resize:", error);
            info.revert();
          }
        },
        eventMouseEnter: async (info) => {
          try {
            if (info.event.extendedProps.plantId) {
              // Only fetch plant details if plantId is available
              const response = await axios.get(`/api/ownPlants/${info.event.extendedProps.plantId}`);
              const plantData = response.data; // Assuming API returns plant details
              // Hier kannst du die Pflanzendaten anzeigen, z.B. in einem Tooltip
              // Beispiel: showPlantTooltip(info.event, plantData);
            }
          } catch (error) {
            //console.error("Error fetching plant data:", error);
          }
        },
        eventMouseLeave: function (info) {},
        eventClick: function (info) {
          const clickedDate = info.jsEvent.dateStr || info.event.startStr; // This is the event's start date in string format
          showRecordPopup(info.event, clickedDate); // Hier wird das Popup mit den Aufzeichnungsdetails angezeigt
        },
      });

      calendar.render();
    }

    if (userId === getUserId()) {
      await initializeDragAndDrop(calendar);
      plantDropListener();
    }
  } catch (error) {
    console.error("Error initializing calendar:", error);
  }
}
