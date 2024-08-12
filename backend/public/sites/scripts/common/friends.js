import { configURL } from "../global.js";

export async function fetchFriends() {
  const friendsList = document.getElementById("friends-container");

  if (!friendsList) {
    console.error("Friends list element not found");
    return;
  }

  try {
    const response = await fetch(`${configURL.API_BASE_URL}/api/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Error fetching friends:", data.message);
      return;
    }

    const data = await response.json();
    friendsList.innerHTML = "";

    if (data.length === 0) {
      console.log("No friends found.");
    } else {
      data.forEach((friend) => {
        const friendItem = document.createElement("div");
        friendItem.classList.add("friend-item");
        friendItem.textContent = friend.username;
        // Entferne das Dataset userId, wenn es nicht mehr benötigt wird
        // friendItem.dataset.userId = friend._id;
        friendsList.appendChild(friendItem);
      });
    }
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
}
