import { configURL, fetchWithAuth } from "../global.js";
import { fetchEvents } from "../calendar/controllers/eventsController.js";

export async function fetchFriends() {
  const friendsList = document.getElementById("friends-container");

  if (!friendsList) {
    console.error("Friends list element not found");
    return;
  }

  try {
    const response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/friends`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      console.error("Error fetching friends:", data.message);
      return;
    }

    const data = await response.json();
    friendsList.innerHTML = "";

    if (data.length === 0) {
      } else {
        data.forEach((friend) => {
        const friendItem = document.createElement("div");
        friendItem.classList.add("friend-item"); 
        friendItem.textContent = friend.username;
        friendItem.dataset.userId = friend._id;
        friendsList.appendChild(friendItem);
      });
    }
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
}
