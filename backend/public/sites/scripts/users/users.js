import { fetchWithAuth } from "../global.js";
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  // Profil laden
  async function loadProfile() {
    try {
      const response = await fetchWithAuth(
        "https://weedbackend.fr4iserhome.com/api/profile/profile",
        {
          // Endpunkt aktualisiert
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Beispiel für Authentifizierung
          },
        },
      );

      if (!response.ok) {
        throw new Error("Error loading profile");
      }

      const profile = await response.json();
        // Weitere Verarbeitung des Profils
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }

  // Profil speichern
  document
    .getElementById("profileForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const updatedProfile = { username, email };
      if (password) {
        updatedProfile.password = password;
      }

      try {
        const response = await fetchWithAuth(
          "https://weedbackend.fr4iserhome.com/api/users/me",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedProfile),
          },
        );
        const data = await response.json();
        if (response.ok) {
          alert("Profil erfolgreich aktualisiert");
          loadProfile();
        } else {
          alert("Fehler beim Aktualisieren des Profils: " + data.message);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    });

  // Freundesliste laden
  async function loadFriends() {
    try {
      const response = await fetchWithAuth(
        "https://weedbackend.fr4iserhome.com/api/friends",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        const friendsList = document.getElementById("friendsList");
        friendsList.innerHTML = "";
        data.forEach((friend) => {
          const listItem = document.createElement("li");
          listItem.className = "friend-item";
          listItem.textContent = `${friend.username} (${friend.email})`;
          friendsList.appendChild(listItem);
        });
      } else {
        console.error("Error loading friends:", data.message);
      }
    } catch (error) {
      console.error("Error loading friends:", error);
    }
  }

  // Benutzer suchen
  document
    .getElementById("searchButton")
    .addEventListener("click", async () => {
      const query = document.getElementById("searchInput").value;
      if (!query) {
        alert("Bitte geben Sie einen Suchbegriff ein.");
        return;
      }

      try {
        const response = await fetchWithAuth(
          `https://weedbackend.fr4iserhome.com/api/friends/search?query=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (response.ok) {
          displaySearchResults(data);
        } else {
          alert("Fehler bei der Suche: " + data.message);
        }
      } catch (error) {
        console.error("Fehler bei der Benutzersuche:", error);
      }
    });

  // Suchergebnisse anzeigen
  function displaySearchResults(users) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    users.forEach((user) => {
      const userDiv = document.createElement("div");
      userDiv.className = "user-result";
      userDiv.textContent = `${user.username} (${user.email})`;
      const addButton = document.createElement("button");
      addButton.textContent = "Freundschaftsanfrage senden";
      addButton.addEventListener("click", () => sendFriendRequest(user._id));
      userDiv.appendChild(addButton);
      resultsContainer.appendChild(userDiv);
    });
  }

  // Freundschaftsanfrage senden
  async function sendFriendRequest(toUserId) {
    try {
      const response = await fetchWithAuth(
        "https://weedbackend.fr4iserhome.com/api/friends/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT-Token aus dem lokalen Speicher
          },
          body: JSON.stringify({ toUserId }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error sending friend request: " + data.message);
      }
        alert("Freundschaftsanfrage gesendet");
    } catch (error) {
      console.error("Fehler beim Senden der Freundschaftsanfrage:", error);
      alert("Fehler beim Senden der Freundschaftsanfrage: " + error.message);
    }
  }

  // Initiale Daten laden
  loadProfile();
  loadFriends();
});
