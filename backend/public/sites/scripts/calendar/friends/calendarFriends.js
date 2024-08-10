import { configURL, fetchWithAuth } from "../../global.js";
import { updateEvent, deleteEvent, createEvent } from "../controllers/eventsController.js";

async function fetchCalendars(userId, calendarSelect) {
  try {
    let response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/calendars`,
      {
        method: "GET",
      },
    );
    let calendars = await response.json();
    if (response.ok) {
      calendars.forEach((calendar) => {
        let option = document.createElement("option");
        option.value = calendar._id;
        option.textContent = calendar.name;
        calendarSelect.appendChild(option);
      });
      loadCalendarEvents(calendars[0]._id); // Load events for the first calendar by default
    } else {
      alert("Error fetching calendars: " + calendars.message);
    }
  } catch (error) {
    console.error("Error fetching calendars:", error);
  }
}

async function loadCalendarEvents(calendarId) {
  const calendarEl = document.getElementById("calendar");
  const token = getToken();

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "de",
    initialView: "dayGridMonth",
    editable: true,
    droppable: true,
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const response = await fetchWithAuth(
          `${configURL.API_BASE_URL}/api/calendar/${calendarId}/events`,
          {
            method: "GET",
          },
        );
        const data = await response.json();
        if (response.ok) {
          successCallback(data);
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("Error fetching events");
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
  const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

  if (userId && calendarSelect) {
    await fetchCalendars(userId, calendarSelect);
  } else {
    console.error("User ID or calendar select element not found.");
  }
});
