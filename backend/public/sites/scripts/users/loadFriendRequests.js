import { fetchWithAuth } from "../global.js";
import { displayFriendRequests } from "./displayFriendRequests.js";

export async function loadFriendRequests() {
  try {
    const response = await fetchWithAuth('/api/friends/requests');
    const requests = await response.json();
    displayFriendRequests(requests);
  } catch (error) {
    console.error('Error loading friend requests:', error);
  }
}
