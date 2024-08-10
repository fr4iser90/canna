import { unblockUser } from "./unblockUser.js";

export function displayBlockedUsers(blockedUsers) {
  const blockedUsersResults = document.getElementById("blocked-users-results");
  blockedUsersResults.innerHTML = "";
  blockedUsers.forEach(user => {
    const div = document.createElement("div");
    div.textContent = `${user.username} (${user.email})`;
    const unblockButton = document.createElement("button");
    unblockButton.textContent = "Unblock";
    unblockButton.addEventListener("click", () => unblockUser(user._id));
    div.appendChild(unblockButton);
    blockedUsersResults.appendChild(div);
  });
}
