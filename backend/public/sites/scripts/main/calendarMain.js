import { finalizeOwnPlantsContainer } from "../plants/finalize/finalizeOwnPlantsContainer.js";
import { fetchFriends } from "../common/friends.js";
import { initializeFriendSearchPopup } from "./friendSearchPopupMain.js";
import { initializeCalendar } from "../calendar/init/initializeCalendar.js";
import { setupEventListeners } from "../calendar/listeners/listeners.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Leeren Kalender initialisieren
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth'
  });
  calendar.render();

  fetchFriends();
  await setupEventListeners();
  await searchFriendsButton();
  
  // Kalender für den eingeloggten Benutzer initialisieren
  await initializeCalendar(); // Keine Benutzer-ID erforderlich
  await finalizeOwnPlantsContainer();
});

export async function searchFriendsButton() {
  const searchFriendsButton = document.getElementById("search-friends-button");
  if (searchFriendsButton) {
    searchFriendsButton.addEventListener("click", async () => {
      try {
        const response = await fetchWithCookies(`/popup/friendSearchPopup`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Network response was not ok. Status:", response.status);
          throw new Error("Network response was not ok");
        }

        const html = await response.text();
  
        const popupContainer = document.createElement("div");
        popupContainer.id = "popupContainer";
        popupContainer.innerHTML = html;
        document.body.appendChild(popupContainer);
        initializeFriendSearchPopup(); // Call the initialization function
        
      } catch (error) {
        console.error("Error loading friend search popup:", error);
        alert("Error loading friend search popup. Please try again.");
      }
    });
  } else {
    console.error("Element with ID search-friends-button not found");
  }
}
