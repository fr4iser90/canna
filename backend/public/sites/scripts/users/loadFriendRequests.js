import { configURL } from "../global.js";
import { displayFriendRequests } from "./displayFriendRequests.js";

export async function loadFriendRequests() {
  try {
    const response = await fetch(
      `${configURL.API_BASE_URL}/api/friends/requests`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.ok) {
      const requests = await response.json();
      displayFriendRequests(requests);
    } else {
      const result = await response.json();
      console.error('Error loading friend requests:', result.message);
    }
  } catch (error) {
    console.error('Error loading friend requests:', error);
  }
}
