import { initializeDragAndDrop } from "../controllers/dragAndDropController.js";
import { fetchEvents, updateEvent } from "../controllers/eventsController.js";
import { showRecordPopup } from "../../popup/recordOwnPlant/showRecordPopup.js";
import { plantDropListener } from "../listeners/listeners.js";

const getDateString = (date) => {
  return new Date(date).toISOString().split("T")[0]; // Returns only the date part (YYYY-MM-DD)
};

let calendar; // Global variable to hold the calendar instance

export async function initializeCalendar() {
  const calendarEl = document.getElementById("calendar");

  if (!calendarEl) {
    console.error("Calendar element not found");
    return;
  }

  try {
    const events = await fetchEvents(); // Fetch events without userId
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
        editable: true, // Editable by default, backend will handle restrictions
        droppable: true,
        events: formattedEvents,
        datesSet: function (info) {
          // Check the number of events in a day and adjust font size
          document.querySelectorAll('.fc-daygrid-day').forEach(day => {
            let events = day.querySelectorAll('.fc-event');
            if (events.length > 3) { // If more than 3 events
              events.forEach(event => {
                event.classList.add('small-font'); // Apply smaller font size
              });
            }
          });
        },
        eventReceive: async (info) => {
          try {
            const plantId = info.draggedEl.getAttribute('data-plant-id');
            const eventExists = await checkPlantEvents(plantId);
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
              // The event creation will now be handled in handleFormSubmission
              updateCalendar(calendar);
              await updateOwnPlantsList();
            });
          } catch (error) {
            console.error("Error receiving event:", error);
          }
        },
        eventDrop: async (info) => {
          try {
            const updatedEvent = {
              id: info.event.id,
              title: info.event.title,
              start: getDateString(info.event.start),
              end: info.event.end ? getDateString(info.event.end) : null,
              plantId: info.event.extendedProps.plantId,
            };

            await updateEvent(updatedEvent);
          } catch (error) {
            console.error("Error handling event drop:", error);
            info.revert();
          }
        },
        eventResize: async (info) => {
          try {
            const updatedEvent = {
              id: info.event.id,
              title: info.event.title,
              start: getDateString(info.event.start),
              end: info.event.end ? getDateString(info.event.end) : null,
              plantId: info.event.extendedProps.plantId,
            };
            await updateEvent(updatedEvent);
          } catch (error) {
            console.error("Error handling event resize:", error);
            info.revert();
          }
        },
        eventClick: function (info) {
          const clickedDate = info.jsEvent.dateStr || info.event.startStr;
          showRecordPopup(info.event, clickedDate); // Show popup with record details
        },
      });

      calendar.render();
    }

    await initializeDragAndDrop(calendar);
    plantDropListener();
  } catch (error) {
    console.error("Error initializing calendar:", error);
  }
}
