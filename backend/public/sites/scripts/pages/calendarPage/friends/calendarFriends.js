import { configURL } from "../../global.js";
import { updateEvent, deleteEvent, createEvent } from "./events.js";

async function fetchCalendars(calendarSelect) {
  try {
    let response = await fetch(`${configURL.API_BASE_URL}/api/calendars`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error fetching calendars");
    }

    let calendars = await response.json();
    calendars.forEach((calendar) => {
      let option = document.createElement("option");
      option.value = calendar._id;
      option.textContent = calendar.name;
      calendarSelect.appendChild(option);
    });

    if (calendars.length > 0) {
      loadCalendarEvents(calendars[0]._id); // Load events for the first calendar by default
    }
  } catch (error) {
    console.error("Error fetching calendars:", error);
    alert("Error fetching calendars: " + error.message);
  }
}

async function loadCalendarEvents(calendarId) {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "de",
    initialView: "dayGridMonth",
    editable: true,
    droppable: true,
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const response = await fetch(
          `${configURL.API_BASE_URL}/api/calendar/${calendarId}/events`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Error fetching events");
        }

        const data = await response.json();
        successCallback(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("Error fetching events: " + error.message);
        failureCallback(error);
      }
    },
    eventDrop: async function (info) {
      await updateEvent(info);
    },
    eventResize: async function (info) {
      await updateEvent(info);
    },
    eventClick: async function (info) {
      if (confirm(`Möchten Sie das Event "${info.event.title}" löschen?`)) {
        const success = await deleteEvent(info.event.id);
        if (success) {
          info.event.remove();
        }
      }
    },
    drop: async function (info) {
      const eventTitle = "Neues Ereignis";
      await createEvent(eventTitle, info.dateStr, calendarId);
    },
  });

  calendar.render();
}

document.addEventListener("DOMContentLoaded", async function () {
  const calendarSelect = document.getElementById("calendarSelect");

  if (calendarSelect) {
    await fetchCalendars(calendarSelect);
  } else {
    console.error("Calendar select element not found.");
  }
});
