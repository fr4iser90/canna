import { deleteFriend } from "./deleteFriend.js";
import { blockFriend } from "./blockFriend.js";

export function displayFriendsList(friends) {
  const friendsListResults = document.getElementById("friends-list-results");
  friendsListResults.innerHTML = "";
  friends.forEach(friend => {
    const div = document.createElement("div");
    div.textContent = `${friend.username} (${friend.email})`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteFriend(friend._id));
    const blockButton = document.createElement("button");
    blockButton.textContent = "Block";
    blockButton.addEventListener("click", () => blockFriend(friend._id));
    div.appendChild(deleteButton);
    div.appendChild(blockButton);
    friendsListResults.appendChild(div);
  });
}
