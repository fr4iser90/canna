import { inviteFriend } from "./inviteFriend.js";

export function displayFriendsSearchResults(results) {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";
  results.forEach(result => {
    const div = document.createElement("div");
    div.textContent = `${result.username} (${result.email})`;
    const inviteButton = document.createElement("button");
    inviteButton.textContent = "Invite";
    inviteButton.addEventListener("click", () => inviteFriend(result._id));
    div.appendChild(inviteButton);
    searchResults.appendChild(div);
  });
}
