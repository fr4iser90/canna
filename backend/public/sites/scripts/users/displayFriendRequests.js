import { handleFriendRequest } from "./handleFriendRequest.js";

export function displayFriendRequests(requests) {
  const requestsResults = document.getElementById("friend-requests-results");
  requestsResults.innerHTML = "";
  requests.forEach(request => {
    const div = document.createElement("div");
    div.textContent = `${request.user1.username} (${request.user1.email})`;
    const acceptButton = document.createElement("button");
    acceptButton.textContent = "Accept";
    acceptButton.addEventListener("click", () => handleFriendRequest(request._id, 'accept'));
    const rejectButton = document.createElement("button");
    rejectButton.textContent = "Reject";
    rejectButton.addEventListener("click", () => handleFriendRequest(request._id, 'reject'));
    div.appendChild(acceptButton);
    div.appendChild(rejectButton);
    requestsResults.appendChild(div);
  });
}
