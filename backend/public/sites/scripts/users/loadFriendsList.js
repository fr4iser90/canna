import { fetchWithAuth } from "../global.js";
import { displayFriendsList } from "./displayFriendsList.js";

export async function loadFriendsList() {
  try {
    const response = await fetchWithAuth('/api/friends');
    const friends = await response.json();
    displayFriendsList(friends);
  } catch (error) {
    console.error('Error loading friends list:', error);
  }
}
