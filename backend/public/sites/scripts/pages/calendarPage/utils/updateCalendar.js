import { fetchEvents } from "../controllers/eventsController.js";

export async function updateCalendar(calendar, userId) {
  try {
    const events = await fetchEvents(userId);
    calendar.removeAllEvents();
    calendar.addEventSource(events);
      calendar.render();
    } catch (error) {
    console.error("Error updating calendar:", error);
  }
}
