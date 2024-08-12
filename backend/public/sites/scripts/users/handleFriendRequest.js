import { configURL } from "../global.js";
import { loadFriendRequests } from "./loadFriendRequests.js";
import { loadFriendsList } from "./loadFriendsList.js";

export async function handleFriendRequest(requestId, action) {
  try {
    const response = await fetch(
      `${configURL.API_BASE_URL}/api/friends/requests/${action}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId })
      }
    );

    if (response.ok) {
      alert(`Friend request ${action}ed!`);
      loadFriendRequests();
      loadFriendsList();
    } else {
      const result = await response.json();
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error handling friend request:', error);
  }
}
