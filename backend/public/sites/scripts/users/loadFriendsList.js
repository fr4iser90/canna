import { displayFriendsList } from "./displayFriendsList.js";

export async function loadFriendsList() {
  try {
    const response = await fetchWithCookies(
      `/api/friends`,
      {
        headers: {
          'Content-Type': 'application/json',
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
