import { configURL } from "../global.js";
import { displayFriendsList } from "./displayFriendsList.js";

export async function loadFriendsList() {
  try {
    const response = await fetch(
      `${configURL.API_BASE_URL}/api/friends`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Falls Authentifizierungs-Header serverseitig erwartet werden, füge sie hier hinzu.
          // 'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.ok) {
      const friends = await response.json();
      displayFriendsList(friends);
    } else {
      const result = await response.json();
      console.error('Error loading friends list:', result.message);
    }
  } catch (error) {
    console.error('Error loading friends list:', error);
  }
}
