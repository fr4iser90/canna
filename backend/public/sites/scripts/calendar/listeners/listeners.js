import { initializeCalendar } from "../init/initializeCalendar.js";

export function setupEventListeners() {
  
  const friendsListEl = document.getElementById("friends-container");
  const myCalendarButton = document.getElementById("my-calendar-button");

  if (friendsListEl) {
    friendsListEl.addEventListener("click", async (event) => {
      if (event.target.classList.contains("friend-item")) {
        // Kalender des Freundes laden, kein userId mehr nötig
        await initializeCalendar(); 
      }
    });
  } else {
    console.error("Element mit ID friends-container not found");
  }

  if (myCalendarButton) {
    myCalendarButton.addEventListener("click", async () => {
      await initializeCalendar();
    });
  } else {
    console.error("Element mit ID my-calendar-button not found");
  }
}

export function plantDropListener() {
  const containerEl = document.getElementById('OwnPlantslist-Container');

  if (containerEl) {
      new FullCalendar.Draggable(containerEl, {
          itemSelector: '.plant-item',
          eventData: function(eventEl) {
              return {
                  title: eventEl.innerText.trim(),
                  extendedProps: {
                      plantId: eventEl.dataset.plantId
                  }
              };
          }
      });

      containerEl.addEventListener('dragstart', (event) => {
          if (event.target.classList.contains('plant-item')) {
              const eventData = {
                  title: event.target.innerText.trim(),
                  extendedProps: {
                      plantId: event.target.dataset.plantId
                  }
              };
              event.dataTransfer.setData('application/json', JSON.stringify(eventData));
          }
      });
  } else {
      console.error('Element mit ID OwnPlantslist-Container nicht gefunden');
  }
}

export function searchFriendsButton() {
  const searchFriendsButton = document.getElementById("search-friends-button");
  if (searchFriendsButton) {
    searchFriendsButton.addEventListener("click", () => {
      fetchWithCookies(`/popup/friendSearchPopup`, { method: 'GET' })
        .then(response => response.text())
        .then(html => {
          document.body.insertAdjacentHTML('beforeend', html);
  
          // Dynamisches Laden des friendSearchPopupMain.js-Skripts
          const script = document.createElement('script');
          script.src = '/sites/scripts/main/friendSearchPopupMain.js';
          script.type = 'module';
          script.defer = true;
          document.body.appendChild(script);
        })
        .catch(error => {
          console.error("Error loading friend search popup:", error);
          alert("Error loading friend search popup. Please try again.");
        });
    });
  } else {
    console.error("Element with ID search-friends-button not found");
  }
}
