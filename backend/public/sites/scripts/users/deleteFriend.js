import { configURL } from "../global.js";
import { loadFriendsList } from "./loadFriendsList.js";

export async function deleteFriend(friendId) {
  try {
    const response = await fetch(
      `${configURL.API_BASE_URL}/api/friends/${friendId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.ok) {
      alert('Friend deleted!');
      loadFriendsList();
    } else {
      const result = await response.json();
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error deleting friend:', error);
  }
}
