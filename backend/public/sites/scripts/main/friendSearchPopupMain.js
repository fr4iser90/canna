import { searchFriends } from "../users/searchFriends.js";
import { inviteFriend } from "../users/inviteFriend.js";
import { loadFriendRequests } from "../users/loadFriendRequests.js";
import { loadFriendsList } from "../users/loadFriendsList.js";
import { loadBlockedUsers } from "../users/loadBlockedUsers.js";

export function initializeFriendSearchPopup() {
  const popup = document.getElementById("friend-search-popup");
  const closeBtn = popup.querySelector(".close");

  if (popup && closeBtn) {
    closeBtn.addEventListener("click", () => {
      popup.parentElement.remove();
    });

    window.addEventListener("click", (event) => {
      if (event.target === popup.parentElement) {
        popup.parentElement.remove();
      }
    });
  } else {
    console.error("Popup or close button not found");
    return;
  }

  // Handle friend search
  const inviteFriendButton = document.getElementById("invite-friend-button");
  inviteFriendButton.addEventListener("click", async () => {
    const query = document.getElementById("friend-search-input").value.trim();
    if (query) {
      await searchFriends(query);
    }
  });

  // Load initial data
  loadFriendRequests();
  loadFriendsList();
  loadBlockedUsers();
}
