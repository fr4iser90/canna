import { configURL } from "../global.js";

document.addEventListener("DOMContentLoaded", function () {
  // Profil laden
  async function loadProfile() {
    try {
      const response = await fetch(
        `${configURL.API_BASE_URL}/api/profile/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
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
        const response = await fetch(
          `${configURL.API_BASE_URL}/api/users/me`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProfile),
          }
        );

        const data = await response.json();
        if (response.ok) {
          alert("Profile updated successfully");
          loadProfile();
        } else {
          alert("Error updating profile: " + data.message);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    });

  // Freundesliste laden
  async function loadFriends() {
    try {
      const response = await fetch(
        `${configURL.API_BASE_URL}/api/friends`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
        alert("Please enter a search term.");
        return;
      }

      try {
        const response = await fetch(
          `${configURL.API_BASE_URL}/api/friends/search?query=${query}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          displaySearchResults(data);
        } else {
          alert("Search error: " + data.message);
        }
      } catch (error) {
        console.error("Error searching for users:", error);
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
      addButton.textContent = "Send friend request";
      addButton.addEventListener("click", () => sendFriendRequest(user._id));
      userDiv.appendChild(addButton);
      resultsContainer.appendChild(userDiv);
    });
  }

  // Freundschaftsanfrage senden
  async function sendFriendRequest(toUserId) {
    try {
      const response = await fetch(
        `${configURL.API_BASE_URL}/api/friends/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ toUserId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Friend request sent");
      } else {
        throw new Error("Error sending friend request: " + data.message);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Error sending friend request: " + error.message);
    }
  }

  // Initiale Daten laden
  loadProfile();
  loadFriends();
});
