import { formatDate } from "../../global.js";

export async function fetchEvents() {
  try {
    const response = await fetch(`/api/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((event) => ({
      id: event._id,
      title: event.title,
      start: new Date(event.start).toISOString().split("T")[0], // Nur das Datum
      end: event.end ? new Date(event.end).toISOString().split("T")[0] : null,
      plantId: event.plantId,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Event für eine bestimmte Pflanze des authentifizierten Benutzers erstellen
export async function createEvent(plantId, eventData) {
  try {
    // Stellen Sie sicher, dass die Daten korrekt formatiert sind
    eventData.start = formatDate(eventData.start);
    eventData.end = formatDate(eventData.end);

    const response = await fetch(`/api/events/${plantId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = `HTTP error! Status: ${response.status}`;
      if (
        response.status === 400 &&
        errorData.message === "Events for this plant already exist"
      ) {
        errorMessage = "Events for this plant already exist";
      }
      const error = new Error(errorMessage);
      error.response = { status: response.status, data: errorData };
      throw error;
    }

    const createdEvent = await response.json();
    return createdEvent;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function updateEvent(eventId, info) {
  const updatedEvent = {
    id: info.event.id,
    title: info.event.title,
    start: new Date(info.event.start).toISOString().split("T")[0], // Nur das Datum
    end: info.event.end
      ? new Date(info.event.end).toISOString().split("T")[0]
      : null,
    plantId: info.event.extendedProps.plantId,
  };

  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
      credentials: "include",
    });

    if (!response.ok) {
      alert(
        "Fehler beim Aktualisieren des Events: " +
          (await response.json()).message,
      );
      info.revert();
    }
  } catch (error) {
    console.error("Error updating event:", error);
    info.revert();
  }
}

// Event für den authentifizierten Benutzer löschen
export async function deleteEvent(plantId) {
  try {
    if (!plantId) {
      console.error("Invalid plant ID. Cannot delete event.");
      alert("Invalid plant ID. Cannot delete event.");
      return false;
    }

    const response = await fetch(`/api/events/${plantId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      return true;
    } else {
      alert("Failed to delete event.");
      return false;
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("An error occurred. Please try again later.");
    return false;
  }
}